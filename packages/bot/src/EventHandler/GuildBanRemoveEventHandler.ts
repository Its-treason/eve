import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { PublicLogCategories, PublicLogger } from '@eve/core';
import { GuildBan } from 'discord.js';
import { AuditLogEvent } from 'discord-api-types/v9';

@injectable()
export default class GuildBanRemoveEventHandler implements EventHandlerInterface {
  constructor(
    private logger: PublicLogger,
  ) { }

  public getNameEventName(): string {
    return 'guildBanRemove';
  }

  public async execute(ban: GuildBan): Promise<void> {
    const auditLogEntries = await ban.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanRemove });
    const auditLogsEntry = auditLogEntries.entries.first();
    if (!auditLogsEntry || auditLogsEntry.executor?.bot) {
      return;
    }

    const message =
      `"${auditLogsEntry.executor!.username}" used native action to unban "${ban.user.username}", original ban reason "${ban.reason || ''}"`;

    await this.logger.createLog(
      message,
      PublicLogCategories.NativeModerationAction,
      [ban.guild.id],
      [ban.user.id, auditLogsEntry.executor!.id],
    );
  }
}

