import { GuildMember, TextChannel } from 'discord.js';
import MustacheReplace from '../Util/MustacheReplace';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import { AutoActionsRepository, AutoRolesAction, JoinMessageAction, Logger } from 'eve-core';

@injectable()
export default class GuildMemberAddEventHandler implements EventHandlerInterface {
  constructor(
    private logger: Logger,
    private actionRepository: AutoActionsRepository,
    private mustacheReplace: MustacheReplace,
  ) {}

  public getNameEventName(): string {
    return 'guildMemberAdd';
  }

  public async execute(member: GuildMember): Promise<void> {
    await this.sendJoinMessage(member);
    await this.applyRoles(member);
  }

  private async applyRoles(member: GuildMember): Promise<void> {
    const autoRolesAction = await this.actionRepository.getActions(member.guild.id, 'auto-roles');
    if (
      !autoRolesAction ||
      !(autoRolesAction instanceof AutoRolesAction) ||
      !autoRolesAction.isEnabled()
    ) {
      return;
    }

    const roles = autoRolesAction.getRoles();
    for (const role of roles) {
      try {
        await member.roles.add(role);
      } catch (error) {
        this.logger.error('An error occurred while sending a auto roles', {
          error: (error as Error),
          role,
          serverId: member.guild.id,
        });
      }
    }
  }

  private async sendJoinMessage(member: GuildMember): Promise<void> {
    const joinAction = await this.actionRepository.getActions(member.guild.id, 'join-message');
    if (
      !joinAction ||
      !(joinAction instanceof JoinMessageAction) ||
      !joinAction.isEnabled() ||
      joinAction.getMessage().length === 0
    ) {
      return;
    }

    let channel = null;
    try {
      channel = await member.guild.channels.fetch(joinAction.getChannel());
    } catch (e) {
      return;
    }

    if (!(channel instanceof TextChannel)) {
      this.logger.warning('Invalid channelId in auto join action', {
        channelId: joinAction.getChannel(),
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

    const message = this.mustacheReplace.replace(joinAction.getMessage(), replacer);

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
        error: (error as Error),
        channelId: joinAction.getChannel(),
        serverId: member.guild.id,
      });
    }
  }
}
