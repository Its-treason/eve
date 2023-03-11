import { Guild } from 'discord.js';
import { ChannelActivityRepository, Logger } from '@eve/core';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';

@injectable()
export default class GuildDeleteEventHandler implements EventHandlerInterface<'guildDelete'> {
  constructor(
    private logger: Logger,
    private channelActivityRepository: ChannelActivityRepository,
  ) {}

  public getEventName() {
    return 'guildDelete' as const;
  }

  public async execute(guild: Guild): Promise<void> {
    this.logger.info('Left guild', {
      serverName: guild.name,
      serverId: guild.id,
    });

    this.channelActivityRepository.recordChannelLeftForServer(guild.id);
  }
}
