import { Logger, mockClass } from '@eve/core';
import exp from 'constants';
import { Guild } from 'discord.js';
import GuildCreateEventHandler from './GuildCreateEventHandler';

describe('GuildCreateEventHandler', () => {
  let eventHandler: GuildCreateEventHandler;

  let logger: Logger;

  beforeEach(() => {
    logger = mockClass(Logger);

    eventHandler = new GuildCreateEventHandler(logger);
  });

  describe('execute', () => {
    it('Can log when added to a guild', async () => {
      const guild = {
        name: 'new-guild',
        id: 'new-guild-id',
      } as Guild;

      await eventHandler.execute(guild);

      expect(logger.info).toBeCalledWith('Joined guild', {
        serverName: 'new-guild',
        serverId: 'new-guild-id',
      });
    });
  });

  describe('getEventName', () => {
    it('Can return the EventName', () => {
      const expected = 'guildCreate';

      expect(eventHandler.getEventName()).toBe(expected);
    });
  });
});
