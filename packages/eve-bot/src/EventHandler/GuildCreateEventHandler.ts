import { Guild } from 'discord.js';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import Logger from "../Structures/Logger";

@injectable()
export default class GuildCreateEventHandler implements EventHandlerInterface {
  constructor(
    private logger: Logger,
  ) {}

  getNameEventName(): string {
    return 'guildCreate';
  }

  public async execute(guild: Guild): Promise<void> {
    this.logger.info('Joined guild', {
      serverName: guild.name,
      serverId: guild.id,
    });
  }
}
