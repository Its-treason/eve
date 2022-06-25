import { GuildMember, TextChannel } from 'discord.js';
import AutoActionsProjection from '../Projection/AutoActionsProjection';
import MustacheReplace from '../Util/MustacheReplace';
import LeaveMessageAction from '../Actions/LeaveMessageAction';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import Logger from "../Structures/Logger";

@injectable()
export default class GuildMemberRemoveEventHandler implements EventHandlerInterface {
  constructor(
    private logger: Logger,
    private actionProjection: AutoActionsProjection,
    private mustacheParser: MustacheReplace,
  ) {}

  public getNameEventName(): string {
    return 'guildMemberRemove';
  }

  public async execute(member: GuildMember): Promise<void> {
    await this.sendLeaveMessage(member);
  }

  private async sendLeaveMessage(member: GuildMember): Promise<void> {
    const leaveAction = await this.actionProjection.getActions(member.guild.id, 'leave-message');
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
    } catch (e) {
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
  }
}
