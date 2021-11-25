import AbstractEventHandler from './AbstractEventHandler';
import Logger from '../Util/Logger';
import { Guild } from 'discord.js';

export default class GuildDeleteEventHandler extends AbstractEventHandler {
  constructor(
    private logger: Logger,
  ) {
    super('guildDelete');

    this.execute = this.execute.bind(this);
  }

  public async execute(guild: Guild): Promise<void> {
    this.logger.info('Left guild', {
      serverName: guild.name,
      serverId: guild.id,
    });
  }
}
