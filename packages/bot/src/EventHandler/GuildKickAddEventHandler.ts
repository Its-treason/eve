import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { PublicLogCategories, PublicLogger } from '@eve/core';
import { GuildMember } from 'discord.js';
import { AuditLogEvent } from 'discord-api-types/v9';

@injectable()
export default class WarnEventHandler implements EventHandlerInterface {
  constructor(
    private logger: PublicLogger,
  ) { }

  public getNameEventName(): string {
    return 'guildMemberRemove';
  }

  public async execute(member: GuildMember): Promise<void> {
    const auditLogEntries = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick });
    const auditLogsEntry = auditLogEntries.entries.first();
    if (!auditLogsEntry) {
      return;
    }

    const message = 
      `"${auditLogsEntry.executor!.username}" used native action to kick "${member.user.username}" for "${auditLogsEntry.reason}"`;

    this.logger.createLog(
      message,
      PublicLogCategories.NativeModerationAction,
      [member.guild.id],
      [member.user.id, auditLogsEntry.executor!.id],
    );
  }
}
