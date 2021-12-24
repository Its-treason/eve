import AbstractEventHandler from './AbstractEventHandler';
import Logger from '../Util/Logger';
import { Guild } from 'discord.js';
import { Injectable } from 'injection-js';

@Injectable()
export default class GuildCreateEventHandler extends AbstractEventHandler {
  constructor(
    private logger: Logger,
  ) {
    super('guildCreate');

    this.execute = this.execute.bind(this);
  }

  public async execute(guild: Guild): Promise<void> {
    this.logger.info('Joined guild', {
      serverName: guild.name,
      serverId: guild.id,
    });
  }
}
