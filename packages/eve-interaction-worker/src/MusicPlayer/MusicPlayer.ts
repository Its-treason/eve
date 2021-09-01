import {StageChannel, TextChannel, ThreadChannel, VoiceChannel} from 'discord.js';
import {AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus} from '@discordjs/voice';
import generateRandomString from '../util/generateRandomString';
import {existsSync, unlinkSync} from 'fs';
import youtubeDlFactory from '../Factory/youtubeDlFactory';
import {YtResult} from '../types';
import Logger from '../util/Logger';
import {QueueItem} from '../types';
import shuffleArray from '../util/shuffleArray';
import messageEmbedFactory from '../Factory/messageEmbedFactory';

export class MusicPlayer {
  private readonly player: AudioPlayer;
  private readonly connection: VoiceConnection

  private queue: QueueItem[];
  private pointer = -1;

  private loop = false;

  private textChannel: TextChannel|ThreadChannel;

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
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    this.connection.once(VoiceConnectionStatus.Ready, () => {
      this.connection.subscribe(this.player);

      this.player.on(AudioPlayerStatus.Idle, this.playNext);
      this.player.stop(true);
    });
  }

  private async playNext(): Promise<void> {
    if (this.queue[this.pointer + 1] === undefined) {
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

    const {url, id} = this.queue[pointer];

    const youtubeDl = youtubeDlFactory();
    try {
      const promise = await youtubeDl.execPromise([
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
      await this.sendPlayError(pointer);
      Logger.error('Error during song downloading!', {error: e, url});
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
    if (this.queue[pointer].downloading !== null) {
      await this.queue[pointer].downloading;
    }

    const {id} = this.queue[pointer];

    if (existsSync(`/tmp/${id}.mp3`) === true) {
      unlinkSync(`/tmp/${id}.mp3`);
    }

    this.queue[pointer].downloaded = false;
  }

  public async addToQueue(ytResult: YtResult): Promise<void> {
    const id = generateRandomString();
    this.queue.push({...ytResult, downloaded: false, id, downloading: null});

    if (this.player.state.status === AudioPlayerStatus.Idle) {
      await this.playNext();
      return;
    }

    if (this.queue[this.pointer + 1]?.id === id) {
      await this.download(this.pointer + 1);
    }
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
  }

  public getVoiceChannelId(): string {
    return this.connection.joinConfig.channelId;
  }

  public togglePause(): 'Paused'|'Unpaused' {
    if (this.player.state.status === AudioPlayerStatus.Paused) {
      this.player.unpause();

      return 'Unpaused';
    }

    this.player.pause();
    return 'Paused';
  }

  public getCurrentPlaying(): QueueItem {
    return this.queue[this.pointer];
  }

  public getQueue(): QueueItem[] {
    return this.queue;
  }

  public getPointer(): number {
    return this.pointer;
  }

  public shuffle(): void {
    const newQueueItem = this.queue.splice(this.pointer, 1)[0];

    this.queue = [newQueueItem, ...shuffleArray(this.queue)];
    this.pointer = 0;

    this.download(this.pointer + 1);
  }

  public loopSong(): boolean {
    this.loop =! this.loop;
    return this.loop;
  }

  public move(item: number, newPosition: number): boolean {
    item -= 1;
    newPosition -= 1;

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

    return true;
  }

  public delete(item: number): boolean {
    item -= 1;

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

    return true;
  }

  private async sendPlayError(pointer: number): Promise<void> {
    if (this.queue[pointer] === undefined) {
      return;
    }

    const {title, uploader} = this.queue[pointer];

    const answer = messageEmbedFactory();
    answer.setTitle('Error during loading');
    answer.setDescription(`${title} uploaded by ${uploader} could not be loaded!`);
    this.textChannel.send({embeds: [answer]});
  }
}
