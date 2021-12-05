import { Pool } from 'mariadb';

export default class ChannelActivityProjection {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private connection: Pool,
  ) {}

  public async recordChannelJoin(userId: string, channelId: string, guildId: string): Promise<void> {
    const sql = 'INSERT INTO `channel_activity` (`user_id`, `guild_id`, `channel_id`, `joined_at`, `left_at`) VALUES (?, ?, ?, CURRENT_TIMESTAMP, NULL)';

    await this.connection.query(sql, [userId, guildId, channelId]);
  }

  public async recordChannelLeft(userId: string, channelId: string, guildId: string): Promise<void> {
    const sql = 'UPDATE `channel_activity` SET left_at = CURRENT_TIMESTAMP WHERE user_id = ? AND guild_id = ? AND channel_id = ? AND left_at IS NULL';

    await this.connection.query(sql, [userId, guildId, channelId]);
  }
}
