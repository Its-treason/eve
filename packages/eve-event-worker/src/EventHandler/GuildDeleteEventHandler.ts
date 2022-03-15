import Logger from '../Util/Logger';
import { Guild } from 'discord.js';
import { injectable } from 'tsyringe';
import EventHandler from './EventHandler';

@injectable()
export default class GuildDeleteEventHandler implements EventHandler {
  constructor(
    private logger: Logger,
  ) {}

  public getNameEventName(): string {
    return 'guildDelete';
  }

  public async execute(guild: Guild): Promise<void> {
    this.logger.info('Left guild', {
      serverName: guild.name,
      serverId: guild.id,
    });
  }
}
