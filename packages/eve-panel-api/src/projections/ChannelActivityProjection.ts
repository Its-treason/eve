import { ChannelActivityRow } from '../types';
import getConnection from '../structures/getConnection';
import dateToDatetime from '../util/dateToDatetime';

export default class ChannelActivityProjection {
  public static async getActivityOForUser(userId: string, startDate: Date, endDate: Date): Promise<ChannelActivityRow[]> {
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

    const result = await getConnection().query(sql, [userId, dateToDatetime(endDate), dateToDatetime(startDate)]);

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
