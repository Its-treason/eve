import { StageChannel, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import generateRandomString from '../Util/generateRandomString';
import { existsSync, unlinkSync } from 'fs';
import youtubeDlFactory from '../Factory/youtubeDlFactory';
import { YtResult } from '../types';
import { QueueItem } from '../types';
import shuffleArray from '../Util/shuffleArray';
import messageEmbedFactory from '../Factory/messageEmbedFactory';

/**
 * @TODO Most lines MusicPlayerClass are for managing the queue. Having the queue in a separate class with helper
 *       methods would probably make the code more readable and this class smaller
 */
export class MusicPlayer {
  public destroyed = false;

  private readonly player: AudioPlayer;
  private readonly connection: VoiceConnection

  private queue: QueueItem[];
  private pointer = -1;

  private loop = false;

  private textChannel: TextChannel|ThreadChannel;

  private leaveTimeout: NodeJS.Timeout = null;

  constructor(channel: VoiceChannel|StageChannel, textChannel: TextChannel|ThreadChannel) {
    this.playNext = this.playNext.bind(this);
    this.queue = [];
    this.textChannel = textChannel;

    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
    });

    this.connection.once(VoiceConnectionStatus.Ready, () => {
      this.connection.subscribe(this.player);
      this.player.on(AudioPlayerStatus.Idle, this.playNext);
      this.player.stop(true);
    });
    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection, VoiceConnectionStatus.Signalling, 2_000),
          entersState(this.connection, VoiceConnectionStatus.Connecting, 2_000),
        ]);
      } catch (error) {
        this.destroy();
      }
    });
  }

  private async playNext(): Promise<void> {
    clearTimeout(this.leaveTimeout);

    if (this.queue[this.pointer + 1] === undefined) {
      this.leaveTimeout = setTimeout(() => {
        this.destroy();
      }, 1.8e+6); // 1.8e+6 => 30 minutes
      return;
    }

    if (this.loop === false) {
      this.pointer++;
    }

    if (this.queue[this.pointer]?.downloaded === false) {
      await this.download(this.pointer);
    }

    if (this.queue[this.pointer] !== undefined) {
      const stream = createAudioResource(`/tmp/${this.queue[this.pointer].id}.flac`);
      this.player.play(stream);
    }

    await this.downloadNextAndRemoveOld();
  }

  private async downloadNextAndRemoveOld(): Promise<void> {
    if (this.queue[this.pointer + 1]?.downloaded === false) {
      await this.download(this.pointer + 1);
    }
    if (this.queue[this.pointer - 1]?.downloaded === true || this.queue[this.pointer - 1]?.downloaded !== null) {
      await this.removeDownload(this.pointer - 1);
    }
  }

  private async download(pointer: number): Promise<void> {
    if (this.queue[pointer]?.downloaded === true) {
      return;
    }
    if (this.queue[pointer]?.downloading !== null) {
      await this.queue[pointer].downloading;
      return;
    }

    const { url, id } = this.queue[pointer];

    const youtubeDl = youtubeDlFactory();
    try {
      const promise = youtubeDl.execPromise([
        url,
        '--audio-format',
        'flac',
        '-x',
        '--restrict-filenames',
        '-o',
        `/tmp/${id}.%(ext)s`,
        '--rm-cache-dir',
        '--audio-quality',
        '0',
        '--format',
        'bestaudio',
      ]);
      this.queue[pointer].downloading = promise;
      await promise;
    } catch (e) {
      console.error(e);
      
      await this.sendPlayError(pointer);
      return;
    } finally {
      this.queue[pointer].downloading = null;
    }

    this.queue[pointer].downloaded = true;
  }

  private async removeDownload(pointer: number) {
    if (this.queue[pointer]?.downloaded !== true) {
      return;
    }
    if (this.queue[pointer]?.downloading instanceof Promise) {
      await this.queue[pointer].downloading;
    }

    const { id } = this.queue[pointer];

    if (existsSync(`/tmp/${id}.mp3`) === true) {
      unlinkSync(`/tmp/${id}.mp3`);
    }

    this.queue[pointer].downloaded = false;
  }

  public async addToQueue(ytResult: YtResult): Promise<void> {
    const id = generateRandomString();
    this.queue.push({ ...ytResult, downloaded: false, id, downloading: null });

    if (
      this.player.state.status === AudioPlayerStatus.Idle
      && !(this.queue[this.pointer]?.downloading instanceof Promise)
    ) {
      this.playNext().catch(console.error);
      return;
    }
    
    this.downloadNextAndRemoveOld().catch(console.error);
  }

  public async skip(): Promise<void> {
    if (this.loop === true) {
      this.pointer++;
    }

    this.player.stop(true);
  }

  public async clear(): Promise<void> {
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i]?.downloaded === true) {
        await this.removeDownload(i);
      }
    }

    this.queue = [];
    this.pointer = -1;

    this.player.stop(true);
  }

  public async destroy(): Promise<void> {
    await this.clear();
    this.connection.disconnect();
    this.destroyed = true;
  }

  public togglePause(): 'Paused'|'Unpaused' {
    if (this.player.state.status === AudioPlayerStatus.Paused) {
      this.player.unpause();

      return 'Unpaused';
    }

    this.player.pause();
    return 'Paused';
  }

  public async shuffle(): Promise<void> {
    const newQueueItem = this.queue.splice(this.pointer, 1)[0];

    this.queue = [newQueueItem, ...shuffleArray(this.queue)];
    this.pointer = 0;

    this.downloadNextAndRemoveOld().catch(console.error);
  }

  public loopSong(): boolean {
    this.loop =! this.loop;
    return this.loop;
  }

  public async move(item: number, newPosition: number): Promise<boolean> {
    item--;
    newPosition--;

    if (this.queue[item] === undefined) {
      return false;
    }

    if (newPosition < 0) {
      newPosition = 0;
    }
    if (newPosition > this.queue.length) {
      newPosition = this.queue.length;
    }

    const itemToMove = this.queue.splice(item, 1)[0];
    this.queue.splice(newPosition, 0, itemToMove);

    if (this.pointer === item) {
      this.pointer = newPosition;
    } else if (this.pointer === newPosition || (newPosition < this.pointer && item > this.pointer)) {
      this.pointer++;
    }

    this.downloadNextAndRemoveOld().catch(console.error);

    return true;
  }

  public async delete(item: number): Promise<boolean> {
    item--;

    if (this.queue[item] === undefined) {
      return false;
    }

    this.queue.splice(item, 1);

    if (this.pointer === item) {
      this.pointer--;
      this.player.stop(true);
    } else if (item < this.pointer) {
      this.pointer--;
    }

    this.downloadNextAndRemoveOld().catch(console.error);

    return true;
  }

  public async goto(position: number): Promise<boolean> {
    position--;

    if (this.queue[position] === undefined) {
      return false;
    }

    this.pointer = (position - 1);
    this.player.stop(true);
    return true;
  }

  private async sendPlayError(pointer: number): Promise<void> {
    if (this.queue[pointer] === undefined) {
      return;
    }

    const { title, uploader } = this.queue[pointer];

    const answer = messageEmbedFactory(this.textChannel.client, 'Error during loading');
    answer.setDescription(`\`${title}\` uploaded by \`${uploader}\` could not be loaded!`);
    this.textChannel.send({ embeds: [answer] });
  }

  public getCurrentPlaying(): QueueItem {
    return this.queue[this.pointer];
  }

  public getVoiceChannelId(): string {
    return this.connection.joinConfig.channelId;
  }

  public getQueue(): QueueItem[] {
    return this.queue;
  }

  public getPointer(): number {
    return this.pointer;
  }
}
