import pool from '../Structures/Pool';
import {YtResult} from '../types';

export default class PlaylistProjection {
  public static async savePlaylist(name: string, userId: string, queue: YtResult[]): Promise<void> {
    const sql = 'INSERT INTO `playlist` (`name`, `user_id`, `queue`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `queue` = ?';

    const jsonQueue = JSON.stringify(queue);
    await pool.query(sql, [name, userId, jsonQueue, jsonQueue]);
  }

  public static async deletePlaylist(name: string, userId: string): Promise<void> {
    const sql = 'DELETE FROM `playlist` WHERE `name` = ? AND `user_id` = ?';

    await pool.query(sql, [name, userId]);
  }

  public static async loadPlaylistByNameAndUserId(name: string, userId: string): Promise<YtResult[]|false> {
    const sql = 'SELECT queue FROM `playlist` WHERE `name` = ? AND `user_id` = ?';

    const result = await pool.query(sql, [name, userId]);

    if (result[0] === undefined) {
      return false;
    }

    const rawQueue = JSON.parse(result[0]['queue']);

    return rawQueue.map((rawYtResult: {[key: string]: string}): YtResult => {
      if (
        typeof rawYtResult.ytId !== 'string' ||
        typeof rawYtResult.url !== 'string' ||
        typeof rawYtResult.title !== 'string' ||
        typeof rawYtResult.uploader !== 'string' ||
        typeof rawYtResult.requestedBy !== 'string'
      ) {
        return;
      }

      return {
        ytId: rawYtResult.ytId,
        url: rawYtResult.url,
        title: rawYtResult.title,
        uploader: rawYtResult.uploader,
        requestedBy: rawYtResult.requestedBy,
      };
    });
  }

  public static async loadPlaylistsOfUser(userId: string): Promise<string[]> {
    const sql = 'SELECT `name` FROM `playlist` WHERE `user_id` = ?';

    const result = await pool.query(sql, [userId]);

    return result.map((item: {name: string}) => {
      return item.name;
    });
  }
}
