import { injectable } from 'tsyringe';
import MySQLClient from '../MySQLClient';
import { ChannelActivityRow } from '../types';

@injectable()
export default class ChannelActivityRepository {
  constructor(
    private connection: MySQLClient,
  ) {}

  public async recordChannelJoin(userId: string, channelId: string, guildId: string): Promise<void> {
    const sql = 'INSERT INTO `channel_activity` (`user_id`, `guild_id`, `channel_id`, `joined_at`, `left_at`) VALUES (?, ?, ?, CURRENT_TIMESTAMP, NULL)';

    await this.connection.query(sql, [userId, guildId, channelId]);
  }

  public async recordChannelLeft(userId: string, channelId: string, guildId: string): Promise<void> {
    const sql = 'UPDATE `channel_activity` SET left_at = CURRENT_TIMESTAMP WHERE user_id = ? AND guild_id = ? AND channel_id = ? AND left_at IS NULL';

    await this.connection.query(sql, [userId, guildId, channelId]);
  }

  public async getActivityOForUser(userId: string, startDate: Date, endDate: Date): Promise<ChannelActivityRow[]> {
    const sql = `
      SELECT
        *
      FROM
        channel_activity
      WHERE
        user_id = ? AND 
        joined_at < ? AND
        left_at > ?
    `;

    const result = await this.connection.query(
      sql,
      [
        userId,
        endDate.toISOString().slice(0, 19).replace('T', ' '),
        startDate.toISOString().slice(0, 19).replace('T', ' '),
      ]
    );

    return result.map((row: Record<string, string>) => {
      return {
        userId: row.user_id,
        channelId: row.channel_id,
        guildId: row.guild_id,
        joinedAt: new Date(row.joined_at),
        leftAt: new Date(row.left_at),
      };
    });
  }
}
