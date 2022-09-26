import { GuildMember, TextChannel } from 'discord.js';
import MustacheReplace from '../Util/MustacheReplace';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import { AutoActionsRepository, LeaveMessageAction, Logger } from '@eve/core';

@injectable()
export default class GuildMemberRemoveEventHandler implements EventHandlerInterface {
  constructor(
    private logger: Logger,
    private actionRepository: AutoActionsRepository,
    private mustacheParser: MustacheReplace,
  ) {}

  public getNameEventName(): string {
    return 'guildMemberRemove';
  }

  public async execute(member: GuildMember): Promise<void> {
    await this.sendLeaveMessage(member);
  }

  private async sendLeaveMessage(member: GuildMember): Promise<void> {
    const leaveAction = await this.actionRepository.getActions(member.guild.id, 'leave-message');
    if (
      !leaveAction ||
      !(leaveAction instanceof LeaveMessageAction) ||
      !leaveAction.isEnabled() ||
      leaveAction.getMessage().length === 0
    ) {
      return;
    }

    let channel = null;
    try {
      channel = await member.guild.channels.fetch(leaveAction.getChannel());
    } catch (error) {
      this.logger.warning('Invalid channelId in auto leave action', {
        channelId: leaveAction.getChannel(),
        serverId: member.guild.id,
        error,
      });
      return;
    }

    if (!(channel instanceof TextChannel)) {
      this.logger.warning('Invalid channelId in auto leave action', {
        channelId: leaveAction.getChannel(),
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

    const message = this.mustacheParser.replace(leaveAction.getMessage(), replacer);

    try {
      await channel.send({
        content: message,
        allowedMentions: {
          users: [],
          parse: [],
        },
      });
    } catch (error) {
      this.logger.error('An error occurred while sending a leave message', {
        error: (error as Error),
        channelId: leaveAction.getChannel(),
        serverId: member.guild.id,
      });
    }

    this.logger.info('Send leave message', {
      message,
      userId: member.id,
      username: member.user.username,
      serverId: member.guild.id,
    });
  }
}
