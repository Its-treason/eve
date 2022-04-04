import getConnection from '../structures/getConnection';
import { RoleMenu, RoleMenuEntry } from '../web/sharedApiTypes';
import * as Process from "process";

interface RoleMenuRow {
  id: string,
  'server_id': string,
  'channel_id': string,
  'message_id': string,
  entries: string,
  message: string,
  name: string,
}

export default class RoleMenuProjection {
  static async saveEntry(
    id: string,
    serverId: string,
    channelId: string,
    messageId: string,
    entries: RoleMenuEntry[],
    message: string,
    name: string,
  ): Promise<void> {
    await getConnection().query(
      'INSERT INTO `role_menu` (`id`, `server_id`, `channel_id`, `message_id`, `entries`, `message`, `name`) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [id, serverId, channelId, messageId, JSON.stringify(entries), message, name],
    );
  }

  static async getAllForServer(guildId: string): Promise<RoleMenu[]> {
    const result = await getConnection().query('SELECT * FROM `role_menu` WHERE server_id = ?', [guildId]);

    return result.map((row: RoleMenuRow): RoleMenu => {
      return {
        id: row.id,
        serverId: row.server_id,
        channelId: row.channel_id,
        messageId: row.message_id,
        entries: JSON.parse(row.entries),
        message: row.message,
        name: row.name,
      };
    });
  }

  static async getRoleMenuRowById(id: string): Promise<RoleMenu | null> {
    const result = await getConnection().query('SELECT * FROM `role_menu` WHERE id = ?', [id]);
  
    if (result[0] === undefined) {
      return null;
    }

    return {
      id: result[0].id,
      serverId: result[0].server_id,
      channelId: result[0].channel_id,
      messageId: result[0].message_id,
      entries: JSON.parse(result[0].entries),
      message: result[0].message,
      name: result[0].name,
    };
  }

  static async updateEntry(
    id: string,
    entries: RoleMenuEntry[],
    message: string,
    messageId: string,
  ): Promise<void> {
    await getConnection().query(
      'UPDATE `role_menu` SET entries = ?, message = ?, message_id = ? WHERE id = ?;',
      [JSON.stringify(entries), message, messageId, id],
    );
  }

  static async updateMessageId(
    id: string,
    messageId: string,
  ): Promise<void> {
    await getConnection().query(
      'UPDATE `role_menu` SET message_id = ? WHERE id = ?;',
      [messageId, id],
    );
  }

  static async removeEntry(
    id: string,
  ): Promise<void> {
    await getConnection().query('DELETE FROM `role_menu` WHERE id = ?', [id]);
  }
}
