import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { PublicLogCategories, PublicLogger } from '@eve/core';
import { GuildBan } from 'discord.js';
import { AuditLogEvent } from 'discord-api-types/v9';

@injectable()
export default class GuildBanAddEventHandler implements EventHandlerInterface<'guildBanAdd'> {
  constructor(
    private logger: PublicLogger,
  ) { }

  public getEventName() {
    return 'guildBanAdd' as const;
  }

  public async execute(ban: GuildBan): Promise<void> {
    // The ban we are getting here is not always complete
    ban = await ban.fetch(true);

    const auditLogEntries = await ban.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanAdd });
    const auditLogsEntry = auditLogEntries.entries.first();
    if (!auditLogsEntry || auditLogsEntry.executor?.bot) {
      return;
    }

    const message =
      `"${auditLogsEntry.executor!.username}" used native action to ban "${ban.user.username}" for "${auditLogsEntry.reason}"`;

    await this.logger.createLog(
      message,
      PublicLogCategories.NativeModerationAction,
      [ban.guild.id],
      [ban.user.id, auditLogsEntry.executor!.id],
    );
  }
}
