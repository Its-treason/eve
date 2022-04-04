import getConnection from '../structures/getConnection';
import { PlaylistItem } from '../web/sharedApiTypes';

export default class PlaylistProjection {
  public static async savePlaylist(name: string, userId: string, queue: PlaylistItem[]): Promise<void> {
    const sql = 'INSERT INTO `playlist` (`name`, `user_id`, `queue`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `queue` = ?';

    const jsonQueue = JSON.stringify(queue);
    await getConnection().query(sql, [name, userId, jsonQueue, jsonQueue]);
  }

  public static async deletePlaylist(name: string, userId: string): Promise<void> {
    const sql = 'DELETE FROM `playlist` WHERE `name` = ? AND `user_id` = ?';

    await getConnection().query(sql, [name, userId]);
  }

  public static async loadPlaylistByNameAndUserId(name: string, userId: string): Promise<PlaylistItem[]|false> {
    const sql = 'SELECT queue FROM `playlist` WHERE `name` = ? AND `user_id` = ?';

    const result = await getConnection().query(sql, [name, userId]);

    if (result[0] === undefined) {
      return false;
    }

    const rawQueue = JSON.parse(result[0]['queue']);

    const playlist = rawQueue.map((rawYtResult: {[key: string]: string}): PlaylistItem|void => {
      return {
        ytId: rawYtResult.ytId,
        url: rawYtResult.url,
        title: rawYtResult.title,
        uploader: rawYtResult.uploader,
        requestedBy: rawYtResult.requestedBy,
      };
    });
    return playlist.filter((item: PlaylistItem) => item !== undefined);
  }

  public static async loadPlaylistsOfUser(userId: string): Promise<string[]> {
    const sql = 'SELECT `name` FROM `playlist` WHERE `user_id` = ?';

    const result = await getConnection().query(sql, [userId]);

    return result.map((item: {name: string}) => {
      return item.name;
    });
  }
}
