import { mockClass, PublicLogCategories, PublicLogger } from '@eve/core';
import { GuildAuditLogsEntry, GuildAuditLogs, AuditLogEvent, GuildBan } from 'discord.js';
import GuildBanRemoveEventHandler from './GuildBanRemoveEventHandler';

describe('GuildBanRemoveEventHandler', () => {
  let eventHandler: GuildBanRemoveEventHandler;

  let logger: PublicLogger;

  beforeEach(() => {
    logger = mockClass(PublicLogger);

    eventHandler = new GuildBanRemoveEventHandler(logger);
  });

  describe('execute', () => {
    it('Can log when ban was removed', async () => {
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

      expect(ban.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberBanRemove });
      expect(auditLogEntries.entries.first).toBeCalled();

      expect(logger.createLog).toBeCalledWith(
        '"the-executor-username" used native action to unban "the-username"',
        PublicLogCategories.NativeModerationAction,
        ['the-guild-id'],
        ['the-banned-user-id', 'the-executor-id'],
      );
    });

    it('Will ignore when action was caused by a bot', async () => {
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

      expect(ban.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberBanRemove });
      expect(auditLogEntries.entries.first).toBeCalled();

      expect(logger.createLog).not.toBeCalled();
    });

    it('Will ignore when no audit log entry was found', async () => {
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

      expect(ban.guild.fetchAuditLogs).toBeCalledWith({ limit: 1, type: AuditLogEvent.MemberBanRemove });
      expect(auditLogEntries.entries.first).toBeCalled();

      expect(logger.createLog).not.toBeCalled();
    });
  });

  describe('getEventName', () => {
    it('Can get EventName', () => {
      const expected = 'guildBanRemove';

      expect(eventHandler.getEventName()).toBe(expected);
    });
  });
});
