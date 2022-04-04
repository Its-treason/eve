import { ChannelActivityRow } from '../types';
import { ActivityRow } from '../web/sharedApiTypes';
import formatSeconds from '../util/formatSeconds';
import { ApiClient } from '../structures/ApiClient';

interface NameWithIcon {
  name: string,
  icon: string,
}

export default class ActivityFormatter {
  private static readonly UNKNOWN_ICON = '/assets/question-mark.png';
  private static readonly UNKNOWN_NAME = 'Not available';
  
  private readonly channelCache: Record<string, string> = {};
  private readonly guildCache: Record<string, NameWithIcon> = {};
  private readonly userCache: Record<string, NameWithIcon> = {};

  private readonly formattedRows: ActivityRow[] = [];

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private client: ApiClient,
  ) {}

  private async resolveUserName(userId: string): Promise<NameWithIcon> {
    if (this.userCache[userId] !== undefined) {
      return this.userCache[userId];
    }

    const user = await this.client.getUser(userId);

    if (user === null) {
      this.userCache[userId] = {
        name: ActivityFormatter.UNKNOWN_NAME,
        icon: ActivityFormatter.UNKNOWN_ICON,
      };
      return this.userCache[userId];
    }

    this.userCache[userId] = {
      name: user.username + user.discriminator,
      icon: this.client.getUserAvatar(user),
    };
    return this.userCache[userId];
  }

  private async resolveGuildName(guildId: string): Promise<NameWithIcon> {
    if (this.guildCache[guildId] !== undefined) {
      return this.guildCache[guildId];
    }

    const guild = await this.client.getGuild(guildId);

    if (guild === null) {
      this.guildCache[guildId] = {
        name: ActivityFormatter.UNKNOWN_NAME,
        icon: ActivityFormatter.UNKNOWN_ICON,
      };
      return this.guildCache[guildId];
    }

    this.guildCache[guildId] = {
      name: guild.name,
      icon: this.client.getGuildIcon(guild),
    };
    return this.guildCache[guildId];
  }

  private async resolveChannelName(channelId: string): Promise<string> {
    if (this.channelCache[channelId] !== undefined) {
      return this.channelCache[channelId];
    }

    const channel = await this.client.getChannel(channelId);

    this.channelCache[channelId] = channel?.name || 'Not available';
    return this.channelCache[channelId];
  }

  public async format(rows: ChannelActivityRow[]): Promise<ActivityRow[]> {
    for (const row of rows) {
      const channelName = await this.resolveChannelName(row.channelId);
      const { name: userName, icon: userIcon } = await this.resolveUserName(row.userId);
      const { name: guildName, icon: guildIcon } = await this.resolveGuildName(row.guildId);

      let length: null|string = null;
      if (row.leftAt !== null) {
        length = formatSeconds(
          ~~((row.leftAt.getTime() - row.joinedAt.getTime()) / 1000),
          2,
        );
      }

      this.formattedRows.push({
        channelName,
        channelId: row.channelId,
        userName,
        userId: row.userId,
        userIcon,
        guildName,
        guildId: row.guildId,
        guildIcon,
        joinedAt: row.joinedAt.toUTCString(),
        leftAt: row.leftAt?.toUTCString(),
        length,
      });
    }

    return this.formattedRows;
  }
}
