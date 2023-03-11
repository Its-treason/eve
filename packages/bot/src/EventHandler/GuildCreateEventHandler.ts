import { Guild } from 'discord.js';
import { Logger } from '@eve/core';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';

@injectable()
export default class GuildCreateEventHandler implements EventHandlerInterface<'guildCreate'> {
  constructor(
    private logger: Logger,
  ) {}

  getEventName() {
    return 'guildCreate' as const;
  }

  public async execute(guild: Guild): Promise<void> {
    this.logger.info('Joined guild', {
      serverName: guild.name,
      serverId: guild.id,
    });
  }
}
