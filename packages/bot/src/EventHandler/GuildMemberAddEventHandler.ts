import { GuildMember, TextChannel } from 'discord.js';
import MustacheReplace from '../Util/MustacheReplace';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import { AutoRolesSetting, JoinMessageSetting, Logger, ServerSettingsRepository } from '@eve/core';

@injectable()
export default class GuildMemberAddEventHandler implements EventHandlerInterface<'guildMemberAdd'> {
  constructor(
    private logger: Logger,
    private serverSettingsRepository: ServerSettingsRepository,
    private mustacheReplace: MustacheReplace,
  ) {}

  public getEventName() {
    return 'guildMemberAdd' as const;
  }

  public async execute(member: GuildMember): Promise<void> {
    await this.sendJoinMessage(member);
    await this.applyRoles(member);
  }

  private async applyRoles(member: GuildMember): Promise<void> {
    const autoRolesAction = await this.serverSettingsRepository.getSetting(member.guild.id, 'auto-roles');
    if (
      !(autoRolesAction instanceof AutoRolesSetting) ||
      !autoRolesAction.getPayload().enabled
    ) {
      return;
    }

    const roles = autoRolesAction.getPayload().roles;
    for (const role of roles) {
      try {
        await member.roles.add(role);
      } catch (error) {
        this.logger.error('An error occurred while sending a auto roles', {
          error,
          role,
          serverId: member.guild.id,
        });
      }
    }

    this.logger.info('Added roles to new user', {
      roles,
      userId: member.id,
      username: member.user.username,
      serverId: member.guild.id,
    });
  }

  private async sendJoinMessage(member: GuildMember): Promise<void> {
    const joinAction = await this.serverSettingsRepository.getSetting(member.guild.id, 'join-message');
    if (
      !joinAction ||
      !(joinAction instanceof JoinMessageSetting) ||
      !joinAction.getPayload().enabled ||
      joinAction.getPayload().message.length === 0
    ) {
      return;
    }

    let channel = null;
    try {
      channel = await member.guild.channels.fetch(joinAction.getPayload().channel);
    } catch (error) {
      this.logger.warning('Invalid channelId in auto join action', {
        channelId: joinAction.getPayload().channel,
        serverId: member.guild.id,
        error,
      });
      return;
    }

    if (!(channel instanceof TextChannel)) {
      this.logger.warning('Invalid channelId in auto join action', {
        channelId: joinAction.getPayload().channel,
        serverId: member.guild.id,
      });
      return;
    }

    const replacer = {
      'user': `${member.user}`,
      'user.name': member.user.username,
      'user.discriminator': member.user.discriminator,
      'user.id': member.user.id,
      'server.name': member.guild.name,
      'server.id': member.guild.id,
      'server.memberCount': `${member.guild.memberCount}`,
    };

    const message = this.mustacheReplace.replace(joinAction.getPayload().message, replacer);

    try {
      await channel.send({
        content: message,
        allowedMentions: {
          users: [],
          parse: [],
        },
      });
    } catch (error) {
      this.logger.error('An error occurred while sending a join message', {
        error,
        channelId: joinAction.getPayload().channel,
        serverId: member.guild.id,
      });
    }

    this.logger.info('Send join message', {
      message,
      userId: member.id,
      username: member.user.username,
      serverId: member.guild.id,
    });
  }
}
