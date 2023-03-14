import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { PublicLogCategories, PublicLogger, sleep } from '@eve/core';
import { GuildMember } from 'discord.js';
import { AuditLogEvent } from 'discord-api-types/v9';

@injectable()
export default class GuildKickEventHandler implements EventHandlerInterface<'guildMemberRemove'> {
  constructor(
    private logger: PublicLogger,
  ) { }

  public getEventName() {
    return 'guildMemberRemove' as const;
  }

  public async execute(member: GuildMember): Promise<void> {
    await sleep(1);

    const auditLogEntries = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick });
    const auditLogsEntry = auditLogEntries.entries.first();
    if (!auditLogsEntry || auditLogsEntry.executor?.bot) {
      return;
    }

    const message =
      `"${auditLogsEntry.executor!.username}" used native action to kick "${member.user.username}" for "${auditLogsEntry.reason || ''}"`;

    await this.logger.createLog(
      message,
      PublicLogCategories.NativeModerationAction,
      [member.guild.id],
      [member.user.id, auditLogsEntry.executor!.id],
    );
  }
}
