import { APIEmbed, GuildMember, TextChannel } from 'discord.js';
import MustacheReplace from '../Util/MustacheReplace';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import { LeaveMessageSetting, Logger, ServerSettingsRepository } from '@eve/core';

@injectable()
export default class GuildMemberRemoveEventHandler implements EventHandlerInterface<'guildMemberRemove'> {
  constructor(
    private logger: Logger,
    private actionRepository: ServerSettingsRepository,
    private mustacheReplace: MustacheReplace,
  ) { }

  public getEventName() {
    return 'guildMemberRemove' as const;
  }

  public async execute(member: GuildMember): Promise<void> {
    await this.sendLeaveMessage(member);
  }

  private async sendLeaveMessage(member: GuildMember): Promise<void> {
    const leaveAction = await this.actionRepository.getSetting(member.guild.id, 'leave-message');
    if (
      !(leaveAction instanceof LeaveMessageSetting) ||
      !leaveAction.getPayload() ||
      leaveAction.getPayload().message.length === 0
    ) {
      return;
    }

    let channel = null;
    try {
      channel = await member.guild.channels.fetch(leaveAction.getPayload().channel);
    } catch (error) {
      this.logger.warning('Invalid channelId in auto leave action', {
        channelId: leaveAction.getPayload().channel,
        serverId: member.guild.id,
        error,
      });
      return;
    }

    if (!(channel instanceof TextChannel)) {
      this.logger.warning('Invalid channelId in auto leave action', {
        channelId: leaveAction.getPayload().channel,
        serverId: member.guild.id,
      });
      return;
    }

    const replacer = {
      'user': `${member.user}`,
      'user.name': member.user.username,
      'user.id': member.user.id,
      'server.name': member.guild.name,
      'server.id': member.guild.id,
      'server.memberCount': `${member.guild.memberCount}`,
    };

    const message = this.mustacheReplace.replace(leaveAction.getPayload().message, replacer);

    const embeds: APIEmbed[] = [];
    let embed = leaveAction.getPayload().embed;
    if (embed) {
      embed = this.mustacheReplace.replaceReducedEmbed(embed, replacer);
      embeds.push({
        title: embed.title,
        description: embed.description,
        fields: embed.fields,
        color: Number.parseInt(embed.color.replace('#', ''), 16),
        footer: {
          text: embed.footer,
        },
      });
    }

    try {
      await channel.send({
        content: message,
        embeds,
        allowedMentions: {
          users: [],
          parse: [],
        },
      });
    } catch (error) {
      this.logger.error('An error occurred while sending a leave message', {
        error: (error as Error),
        channelId: leaveAction.getPayload().channel,
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
