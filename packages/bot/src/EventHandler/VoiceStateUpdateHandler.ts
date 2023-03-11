import { VoiceState } from 'discord.js';
import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { ChannelActivityRepository } from '@eve/core';

@injectable()
export default class VoiceStateUpdateHandler implements EventHandlerInterface<'voiceStateUpdate'> {
  constructor(
    private channelActivityRepository: ChannelActivityRepository,
  ) {}

  getEventName() {
    return 'voiceStateUpdate' as const;
  }

  public async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
    await this.recordChannelActivity(oldState, newState);
  }

  private async recordChannelActivity(oldState: VoiceState, newState: VoiceState): Promise<void> {
    if (typeof oldState.channel?.id === 'string' && oldState.channel.id !== newState.channel?.id) {
      await this.channelActivityRepository.recordChannelLeft(
        oldState.member?.id || 'Unknown',
        oldState.channel.id,
        oldState.guild.id,
      );
    }

    if (typeof newState.channel?.id === 'string' && oldState.channel?.id !== newState.channel.id) {
      await this.channelActivityRepository.recordChannelJoin(
        newState.member?.id || 'Unknown',
        newState.channel.id,
        newState.guild.id,
      );
    }
  }
}
