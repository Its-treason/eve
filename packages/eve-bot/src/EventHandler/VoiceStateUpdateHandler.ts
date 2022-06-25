import { VoiceState } from 'discord.js';
import ChannelActivityProjection from '../Projection/ChannelActivityProjection';
import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';

@injectable()
export default class VoiceStateUpdateHandler implements EventHandlerInterface {
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
        oldState.member?.id || 'Unknown',
        oldState.channel.id,
        oldState.guild.id,
      );
    }

    if (typeof newState.channel?.id === 'string' && oldState.channel?.id !== newState.channel.id) {
      await this.channelActivityProjection.recordChannelJoin(
        newState.member?.id || 'Unknown',
        newState.channel.id,
        newState.guild.id,
      );
    }
  }
}
