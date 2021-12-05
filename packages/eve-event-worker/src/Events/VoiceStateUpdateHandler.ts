import { VoiceState } from 'discord.js';
import ChannelActivityProjection from '../Projection/ChannelActivityProjection';
import AbstractEventHandler from './AbstractEventHandler';

export default class VoiceStateUpdateHandler extends AbstractEventHandler {
  private channelActivityProjection: ChannelActivityProjection;

  constructor(channelActivityProjection: ChannelActivityProjection) {
    super('voiceStateUpdate');

    this.execute = this.execute.bind(this);
    this.channelActivityProjection = channelActivityProjection;
  }

  public async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
    await this.recordChannelActivity(oldState, newState);
  }

  private async recordChannelActivity(oldState: VoiceState, newState: VoiceState): Promise<void> {
    if (typeof oldState.channel?.id === 'string' && oldState.channel.id !== newState.channel?.id) {
      await this.channelActivityProjection.recordChannelLeft(
        oldState.member?.id || 'Unkown',
        oldState.channel.id,
        oldState.guild.id,
      );
    }

    if (typeof newState.channel?.id === 'string' && oldState.channel?.id !== newState.channel.id) {
      await this.channelActivityProjection.recordChannelJoin(
        newState.member?.id || 'Unkown',
        newState.channel.id,
        newState.guild.id,
      );
    }
  }
}
