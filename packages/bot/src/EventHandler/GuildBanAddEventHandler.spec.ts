import { mockClass, PublicLogCategories, PublicLogger } from '@eve/core';
import { AuditLogEvent, GuildAuditLogs, GuildAuditLogsEntry, GuildBan } from 'discord.js';
import GuildBanAddEventHandler from './GuildBanAddEventHandler';

describe('GuildBanAddEventHandler', () => {
  let eventHandler: GuildBanAddEventHandler;

  let publicLogger: PublicLogger;

  beforeEach(() => {
    publicLogger = mockClass(PublicLogger);

    eventHandler = new GuildBanAddEventHandler(publicLogger);
  });

  describe('execute', () => {
    it('Can log guild ban', async () => {
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
      } as unknown as GuildAuditLogs<AuditLogEvent.MemberBanAdd>;

      const ban = {
        fetch: jest.fn(() => ban),
        guild: {
          fetchAuditLogs: jest.fn(() => auditLogEntries),
          id: 'the-guild-id',
        },
        user: {
          id: 'the-banned-user-id',
          username: 'the-username',
        },
      } as unknown as GuildBan;

      await eventHandler.execute(ban);

      expect(ban.fetch).toBeCalledWith(true);

      expect(ban.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberBanAdd });

      expect(auditLogEntries.entries.first).toBeCalled();

      expect(publicLogger.createLog).toBeCalledWith(
        '"the-executor-username" used native action to ban "the-username" for "user did an opsie"',
        PublicLogCategories.NativeModerationAction,
        ['the-guild-id'],
        ['the-banned-user-id', 'the-executor-id'],
      );
    });

    it('Will ignore bans created by bots', async () => {
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
      } as unknown as GuildAuditLogs<AuditLogEvent.MemberBanAdd>;

      const ban = {
        fetch: jest.fn(() => ban),
        guild: {
          fetchAuditLogs: jest.fn(() => auditLogEntries),
          id: 'the-guild-id',
        },
        user: {
          id: 'the-banned-user-id',
          username: 'the-username',
        },
      } as unknown as GuildBan;

      await eventHandler.execute(ban);

      expect(ban.fetch).toBeCalledWith(true);

      expect(ban.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberBanAdd });

      expect(auditLogEntries.entries.first).toBeCalled();

      expect(publicLogger.createLog).not.toBeCalled();
    });

    it('Will ignore when no audit log entry is found', async () => {
      const auditLogEntries = {
        entries: {
          first: jest.fn(() => null),
        },
      } as unknown as GuildAuditLogs<AuditLogEvent.MemberBanAdd>;

      const ban = {
        fetch: jest.fn(() => ban),
        guild: {
          fetchAuditLogs: jest.fn(() => auditLogEntries),
          id: 'the-guild-id',
        },
        user: {
          id: 'the-banned-user-id',
          username: 'the-username',
        },
      } as unknown as GuildBan;

      await eventHandler.execute(ban);

      expect(ban.fetch).toBeCalledWith(true);

      expect(ban.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberBanAdd });

      expect(auditLogEntries.entries.first).toBeCalled();

      expect(publicLogger.createLog).not.toBeCalled();
    });
  });

  describe('getEventName', () => {
    it('Can get EventName', () => {
      const expected = 'guildBanAdd';

      expect(eventHandler.getEventName()).toBe(expected);
    });
  });
});
