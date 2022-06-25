import 'reflect-metadata';
import GuildCreateEventHandler from './GuildCreateEventHandler';
import { Guild } from 'discord.js';
import Logger from "../Structures/Logger";

jest.mock('../Util/Logger');

describe('GuildCreateEventHandler', () => {
  test('Can log new guild', async () => {
    const logger = new Logger();

    const guild = {
      id: 'some-id',
      name: 'some-guild',
    } as Guild;

    const handler = new GuildCreateEventHandler(logger);
    await handler.execute(guild);

    expect(logger.info).toHaveBeenCalledWith(
      'Joined guild',
      {
        serverName: guild.name,
        serverId: guild.id,
      },
    );
  });
});
