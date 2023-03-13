import GuildDeleteEventHandler from './GuildDeleteEventHandler';
import { ChannelActivityRepository, Logger, mockClass } from '@eve/core';
import { Guild } from 'discord.js';

describe('GuildDeleteEventHandler', () => {
  let eventHandler: GuildDeleteEventHandler;

  let logger: Logger;
  let channelActivity: ChannelActivityRepository;

  beforeEach(() => {
    logger = mockClass(Logger);
    channelActivity = mockClass(ChannelActivityRepository);

    eventHandler = new GuildDeleteEventHandler(logger, channelActivity);
  });

  describe('execute', () => {
    it('Can log when bot left guild', async () => {
      const guild = {
        name: 'the-old-guild',
        id: 'the-old-guild-id',
      } as Guild;

      await eventHandler.execute(guild);

      expect(logger.info).toBeCalledWith('Left guild', {
        serverName: 'the-old-guild',
        serverId: 'the-old-guild-id',
      });
      expect(channelActivity.recordChannelLeftForServer).toBeCalledWith('the-old-guild-id');
    });
  });

  describe('getEventName', () => {
    it('Can return the EventName', () => {
      const expected = 'guildDelete';

      expect(eventHandler.getEventName()).toBe(expected);
    });
  });
});
