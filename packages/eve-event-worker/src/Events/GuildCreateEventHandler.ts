import AbstractEventHandler from './AbstractEventHandler';
import Logger from '../Util/Logger';
import { Guild } from 'discord.js';

export default class GuildCreateEventHandler extends AbstractEventHandler {
  private logger: Logger;

  constructor(logger: Logger) {
    super('guildCreate');

    this.execute = this.execute.bind(this);
    this.logger = logger;
  }

  public async execute(guild: Guild): Promise<void> {
    this.logger.info('Joined guild', {
      serverName: guild.name,
      serverId: guild.id,
    });
  }
}
