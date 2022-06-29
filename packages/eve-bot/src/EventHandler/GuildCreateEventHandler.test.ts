import 'reflect-metadata';
import GuildCreateEventHandler from './GuildCreateEventHandler';
import { Guild } from 'discord.js';
import { Logger } from 'eve-core';

jest.mock('eve-core');

describe('GuildCreateEventHandler', () => {
  test('Can log new guild', async () => {
    const logger = new Logger(null);

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
