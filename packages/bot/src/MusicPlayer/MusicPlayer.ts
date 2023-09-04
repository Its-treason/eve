import { TextBasedChannel, VoiceBasedChannel } from 'discord.js';
import { MusicResult } from '../types';
import shuffleArray from '../Util/shuffleArray';
import messageEmbedFactory from '../Factory/messageEmbedFactory';
import yasha from 'yasha';
import { container } from 'tsyringe';
import { Logger } from '@eve/core';

export class MusicPlayer {
  public destroyed = false;

  private readonly player: yasha.TrackPlayer;
  private connection: yasha.VoiceConnection | null = null;

  private queue: MusicResult[];
  private pointer = -1;

  private loop = false;

  private textChannel: TextBasedChannel;

  private leaveTimeout?: NodeJS.Timeout;

  private readonly voiceChannelId: string;

  constructor(channel: VoiceBasedChannel, textChannel: TextBasedChannel) {
    this.playNext = this.playNext.bind(this);
    this.handleError = this.handleError.bind(this);
    this.queue = [];
    this.textChannel = textChannel;
    this.voiceChannelId = channel.id;

    this.player = new yasha.TrackPlayer();

    yasha.VoiceConnection.connect(channel).then((connection) => {
      this.connection = connection;

      this.connection.subscribe(this.player);

      this.player.on('finish', this.playNext);
      this.player.on('error', this.handleError);
    });
  }

  private async playNext(): Promise<void> {
    clearTimeout(this.leaveTimeout);

    if (this.loop === true && this.player.hasPlayer()) {
      this.player.seek(0);
      return;
    }

    if (this.queue[this.pointer + 1] === undefined) {
      this.leaveTimeout = setTimeout(() => {
        this.destroy();
      }, 30_000);
      this.player.cleanup();
      return;
    }

    this.pointer++;

    this.player.play(this.queue[this.pointer].track);
    await this.player.start();
  }

  public async addToQueue(ytResult: MusicResult): Promise<void> {
    this.queue.push(ytResult);

    if (!this.player.hasPlayer()) {
      await this.playNext();
    }
  }

  public async skip(): Promise<void> {
    if (this.loop === true) {
      this.pointer++;
    }

    this.player.stop();
    await this.playNext();
  }

  public async clear(): Promise<void> {
    this.queue = [];
    this.pointer = -1;

    this.player.stop();
    await this.playNext();
  }

  public async destroy(): Promise<void> {
    this.player.destroy();
    await this.clear();
    this.connection?.disconnect();
    this.destroyed = true;
  }

  public togglePause(): 'Paused'|'Unpaused' {
    if (this.player.isPaused()) {
      this.player.setPaused(false);

      return 'Unpaused';
    }

    this.player.setPaused(true);
    return 'Paused';
  }

  public async shuffle(): Promise<void> {
    const currentQueueItem = this.queue.splice(this.pointer, 1)[0];

    this.queue = [currentQueueItem, ...shuffleArray(this.queue)];
    this.pointer = 0;
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

    const currentPlaying = this.queue[this.pointer];

    const itemToMove = this.queue.splice(item, 1)[0];
    this.queue.splice(newPosition, 0, itemToMove);

    const currentPlayingNewIndex = this.queue.findIndex((item) => item === currentPlaying);
    if (currentPlayingNewIndex !== -1) {
      this.pointer = currentPlayingNewIndex;
    }

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
      this.player.stop();
    } else if (item < this.pointer) {
      this.pointer--;
    }

    return true;
  }

  public async goto(position: number): Promise<boolean> {
    // The queue is an array that starts at 0 but the position starts at 1
    position--;

    if (this.queue[position] === undefined) {
      return false;
    }

    // set the pointer on the position before we want to go beca
    this.pointer = (position - 1);
    this.player.stop();
    await this.playNext();
    return true;
  }

  private async handleError(error: Error): Promise<void> {
    const logger = container.resolve(Logger);
    logger.error('Music player error', { error });

    let msg = 'Internal Player Error';
    if (error instanceof yasha.UnplayableError) {
      msg = error.message;
    }

    if (this.queue[this.pointer] === undefined) {
      return;
    }

    const { title, uploader } = this.queue[this.pointer];

    const answer = messageEmbedFactory(this.textChannel.client, 'An error occurred while playing a track');
    answer.setDescription(`\`${title}\` uploaded by \`${uploader}\` could not be loaded!`);
    answer.addFields([{ name: 'Error Message', value: msg }]);
    this.textChannel.send({ embeds: [answer] });

    // Disable the loop to make sure the player tries to play the same track again and then die again
    this.loop = false;
    await this.playNext();
  }

  public getCurrentPlaying(): MusicResult {
    return this.queue[this.pointer];
  }

  public getVoiceChannelId(): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // This is a nasty hack to get the current channel id from the internal connection state
    // Because the connection is created asynchronous it is not present at the start so we fallback on the
    // voiceChannelId. If the voiceChannel check brakes after moving the bot this here might be the reason
    return this.connection ? this.connection.packets?.state?.channel_id : this.voiceChannelId;
  }

  public getQueue(): MusicResult[] {
    return this.queue;
  }

  public getPointer(): number {
    return this.pointer;
  }
}
