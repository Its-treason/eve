import { mockClass, PublicLogCategories, PublicLogger } from '@eve/core';
import { AuditLogEvent, Guild, GuildAuditLogs, GuildAuditLogsEntry, GuildListMembersOptions, GuildMember } from 'discord.js';
import GuildKickAddEventHandler from './GuildKickAddEventHandler';

describe('GuildKickAddEventHandler', () => {
  let eventHandler: GuildKickAddEventHandler;

  let publicLogger: PublicLogger;

  beforeEach(() => {
    publicLogger = mockClass(PublicLogger);

    eventHandler = new GuildKickAddEventHandler(publicLogger);
  });

  describe('execute', () => {
    it('Can log when member is kicked', async () => {
      const auditLogsEntry = {
        reason: 'user did an opsie',
        executor: {
          bot: false,
          id: 'the-executor-id',
          username: 'the-executor-username',
        },
      } as unknown as GuildAuditLogsEntry;

      const auditLogEntries = {
        entries: {
          first: jest.fn(() => auditLogsEntry),
        },
      } as unknown as GuildAuditLogs<AuditLogEvent.MemberKick>;

      const member = {
        guild: {
          fetchAuditLogs: jest.fn(() => auditLogEntries),
          id: 'the-guild-id',
        },
        user: {
          username: 'the-kicked-user',
          id: 'the-kicked-user-id',
        },
      } as unknown as GuildMember;

      await eventHandler.execute(member);

      expect(member.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberKick });

      expect(publicLogger.createLog).toBeCalledWith(
        '"the-executor-username" used native action to kick "the-kicked-user" for "user did an opsie"',
        PublicLogCategories.NativeModerationAction,
        ['the-guild-id'],
        ['the-kicked-user-id', 'the-executor-id'],
      );
    });

    it('Will ignore when no auditlog was found', async () => {
      const auditLogEntries = {
        entries: {
          first: jest.fn(() => null),
        },
      } as unknown as GuildAuditLogs<AuditLogEvent.MemberKick>;

      const member = {
        guild: {
          fetchAuditLogs: jest.fn(() => auditLogEntries),
          id: 'the-guild-id',
        },
        user: {
          username: 'the-kicked-user',
          id: 'the-kicked-user-id',
        },
      } as unknown as GuildMember;

      await eventHandler.execute(member);

      expect(member.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberKick });

      expect(publicLogger.createLog).not.toBeCalled();
    });

    it('It will ignore when executor is a bot', async () => {
      const auditLogsEntry = {
        reason: 'user did an opsie',
        executor: {
          bot: true,
          id: 'the-executor-id',
          username: 'the-executor-username',
        },
      } as unknown as GuildAuditLogsEntry;

      const auditLogEntries = {
        entries: {
          first: jest.fn(() => auditLogsEntry),
        },
      } as unknown as GuildAuditLogs<AuditLogEvent.MemberKick>;

      const member = {
        guild: {
          fetchAuditLogs: jest.fn(() => auditLogEntries),
          id: 'the-guild-id',
        },
        user: {
          username: 'the-kicked-user',
          id: 'the-kicked-user-id',
        },
      } as unknown as GuildMember;

      await eventHandler.execute(member);

      expect(member.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberKick });

      expect(publicLogger.createLog).not.toBeCalled();
    });
  });

  describe('getEventName', () => {
    it('Can return the EventName', () => {
      const expected = 'guildMemberRemove';

      expect(eventHandler.getEventName()).toBe(expected);
    });
  });
});
