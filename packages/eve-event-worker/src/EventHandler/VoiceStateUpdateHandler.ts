import { VoiceState } from 'discord.js';
import ChannelActivityProjection from '../Projection/ChannelActivityProjection';
import AbstractEventHandler from './EventHandler';
import EventHandler from './EventHandler';
import { injectable } from 'tsyringe';

@injectable()
export default class VoiceStateUpdateHandler implements EventHandler {
  constructor(
    private channelActivityProjection: ChannelActivityProjection
  ) {}

  getNameEventName(): string {
    return 'voiceStateUpdate';
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
