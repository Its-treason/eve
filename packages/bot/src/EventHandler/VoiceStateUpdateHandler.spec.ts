import { ChannelActivityRepository, mockClass } from '@eve/core';
import { VoiceState } from 'discord.js';
import VoiceStateUpdateHandler from './VoiceStateUpdateHandler';

describe('VoiceStateUpdateHandler', () => {
  let eventHandler: VoiceStateUpdateHandler;

  let channelActivityRepository: ChannelActivityRepository;

  beforeEach(() => {
    channelActivityRepository = mockClass(ChannelActivityRepository);

    eventHandler = new VoiceStateUpdateHandler(channelActivityRepository);
  });

  describe('execute', () => {
    it('Can log when state changed', async () => {
      const oldState = {
        channel: { id: 'old-channel-id' },
        member: { id: 'old-member-id' },
        guild: { id: 'old-guild-id' },
      } as unknown as VoiceState;

      const newState = {
        channel: { id: 'new-channel-id' },
        member: { id: 'new-member-id' },
        guild: { id: 'new-guild-id' },
      } as unknown as VoiceState;

      await eventHandler.execute(oldState, newState);

      expect(channelActivityRepository.recordChannelLeft).toBeCalledWith('old-member-id', 'old-channel-id', 'old-guild-id');
      expect(channelActivityRepository.recordChannelJoin).toBeCalledWith('new-member-id', 'new-channel-id', 'new-guild-id');
    });

    it('Can log when joined vc', async () => {
      const oldState = {
        channel: null,
        member: { id: 'old-member-id' },
        guild: { id: 'old-guild-id' },
      } as unknown as VoiceState;

      const newState = {
        channel: { id: 'new-channel-id' },
        member: { id: 'new-member-id' },
        guild: { id: 'new-guild-id' },
      } as unknown as VoiceState;

      await eventHandler.execute(oldState, newState);

      expect(channelActivityRepository.recordChannelLeft).not.toBeCalled();
      expect(channelActivityRepository.recordChannelJoin).toBeCalledWith('new-member-id', 'new-channel-id', 'new-guild-id');
    });

    it('Can log when left vc', async () => {
      const oldState = {
        channel: { id: 'old-channel-id' },
        member: { id: 'old-member-id' },
        guild: { id: 'old-guild-id' },
      } as unknown as VoiceState;

      const newState = {
        channel: null,
        member: { id: 'new-member-id' },
        guild: { id: 'new-guild-id' },
      } as unknown as VoiceState;

      await eventHandler.execute(oldState, newState);

      expect(channelActivityRepository.recordChannelLeft).toBeCalledWith('old-member-id', 'old-channel-id', 'old-guild-id');
      expect(channelActivityRepository.recordChannelJoin).not.toBeCalled();
    });
  });

  describe('getEventName', () => {
    it('Can return the EventName', () => {
      const expected = 'voiceStateUpdate';

      expect(eventHandler.getEventName()).toBe(expected);
    });
  });
});
