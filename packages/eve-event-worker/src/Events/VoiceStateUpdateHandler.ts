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
    if (oldState.channel?.id !== null) {
      await this.channelActivityProjection.recordChannelLeft(oldState.member.id, oldState.channel.id, oldState.guild.id);
    }

    if (newState.channel?.id !== null) {
      await this.channelActivityProjection.recordChannelJoin(newState.member.id, newState.channel.id, newState.guild.id);
    }
  }
}
