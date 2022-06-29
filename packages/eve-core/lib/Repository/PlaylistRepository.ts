import { injectable } from 'tsyringe';
import MySQLClient from '../MySQLClient';
import { PlaylistItem } from '../types';

@injectable()
export default class PlaylistRepository {
  constructor(
    private connection: MySQLClient,
  ) {}

  public async savePlaylist(name: string, userId: string, queue: PlaylistItem[]): Promise<void> {
    const sql = 'INSERT INTO `playlist` (`name`, `user_id`, `queue`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `queue` = ?';

    const jsonQueue = JSON.stringify(queue);
    await this.connection.query(sql, [name, userId, jsonQueue, jsonQueue]);
  }

  public async deletePlaylist(name: string, userId: string): Promise<void> {
    const sql = 'DELETE FROM `playlist` WHERE `name` = ? AND `user_id` = ?';

    await this.connection.query(sql, [name, userId]);
  }

  public async loadPlaylistByNameAndUserId(name: string, userId: string): Promise<PlaylistItem[]|false> {
    const sql = 'SELECT queue FROM `playlist` WHERE `name` = ? AND `user_id` = ?';

    const result = await this.connection.query(sql, [name, userId]);

    if (result[0] === undefined) {
      return false;
    }

    const rawQueue = JSON.parse(result[0]['queue']);

    return rawQueue.map((rawYtResult: {[key: string]: string}): PlaylistItem => {
      return {
        ytId: String(rawYtResult.ytId),
        url: String(rawYtResult.url),
        title: String(rawYtResult.title),
        uploader: String(rawYtResult.uploader),
      };
    });
  }

  public async loadPlaylistsOfUser(userId: string): Promise<string[]> {
    const sql = 'SELECT `name` FROM `playlist` WHERE `user_id` = ?';

    const result = await this.connection.query(sql, [userId]);

    return result.map((item: {name: string}) => {
      return item.name;
    });
  }
}
