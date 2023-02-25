import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { PublicLogCategories, PublicLogger, sleep } from '@eve/core';
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
    await sleep(1);

    const auditLogEntries = await ban.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanRemove });
    const auditLogsEntry = auditLogEntries.entries.first();
    if (!auditLogsEntry || auditLogsEntry.executor?.bot) {
      return;
    }

    const message =
      `"${auditLogsEntry.executor!.username}" used native action to unban "${ban.user.username}"`;

    await this.logger.createLog(
      message,
      PublicLogCategories.NativeModerationAction,
      [ban.guild.id],
      [ban.user.id, auditLogsEntry.executor!.id],
    );
  }
}

