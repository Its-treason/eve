import { PublicLogger, PublicLogCategories } from "@eve/core";
import { AuditLogEvent, GuildAuditLogsEntry, Guild, User, Client } from "discord.js";
import { singleton } from "tsyringe";
import EventHandlerInterface from "./EventHandlerInterface";

@singleton()
export default class GuildAuditLogEntryCreate implements EventHandlerInterface<'guildAuditLogEntryCreate'> {
  constructor(
    private logger: PublicLogger,
  ) { }

  public getEventName() {
    return 'guildAuditLogEntryCreate' as const;
  }

  public async execute(auditLogsEntry: GuildAuditLogsEntry, guild: Guild): Promise<void> {
    switch (auditLogsEntry.action) {
      case AuditLogEvent.MemberKick:
        await this.logKick(auditLogsEntry, guild);
        return;
      case AuditLogEvent.MemberBanAdd:
        await this.logBan(auditLogsEntry, guild);
        return;
      case AuditLogEvent.MemberBanRemove:
        await this.logUnban(auditLogsEntry, guild);
        return;
    }
  }

  private async logKick(event: GuildAuditLogsEntry, guild: Guild): Promise<void> {
    const users = await this.fetchTargetAndExecutor(event, guild.client);
    if (!users || users.executor.bot) {
      return;
    }
    const { target, executor } = users;

    await this.logger.createLog(
      `"${executor!.username}" used native action to kick "${target!.username}" for "${event.reason || ''}"`,
      PublicLogCategories.NativeModerationAction,
      [guild.id],
      [executor.id, target.id],
    );
  }

  private async logBan(event: GuildAuditLogsEntry, guild: Guild) {
    const users = await this.fetchTargetAndExecutor(event, guild.client);
    if (!users || users.executor.bot) {
      return;
    }
    const { target, executor } = users;

    await this.logger.createLog(
      `"${executor.username}" used native action to ban "${target.username}" for "${event.reason}"`,
      PublicLogCategories.NativeModerationAction,
      [guild.id],
      [executor.id, target.id],
    );
  }

  private async logUnban(event: GuildAuditLogsEntry, guild: Guild) {
    const users = await this.fetchTargetAndExecutor(event, guild.client);
    if (!users || users.executor.bot) {
      return;
    }
    const { target, executor } = users;

    await this.logger.createLog(
      `"${executor.username}" used native action to unban "${target.username}"`,
      PublicLogCategories.NativeModerationAction,
      [guild.id],
      [executor.id, target.id],
    );
  }

  private async fetchTargetAndExecutor(event: GuildAuditLogsEntry, client: Client) {
    if (!event.targetId || !event.executorId) {
      return null;
    }

    let target, executor: User;
    try {
      target = await client.users.fetch(event.targetId);
      executor = await client.users.fetch(event.executorId);
    } catch {
      return null;
    }

    return { target, executor };
  }
}
