import { ReducedEmbed } from '@eve/types/api';
import { injectable } from 'tsyringe';
import MySQLClient from '../MySQLClient';
import { RoleMenu, RoleMenuEntry } from '../types';

type RoleMenuRow = {
  id: string,
  'server_id': string,
  'channel_id': string,
  'message_id': string,
  entries: string,
  message: string,
  embed: string,
  name: string,
}

@injectable()
export default class RoleMenuRepository {
  constructor(
    private connection: MySQLClient,
  ) {}

  async saveEntry(
    id: string,
    serverId: string,
    channelId: string,
    messageId: string,
    entries: RoleMenuEntry[],
    message: string,
    name: string,
  ): Promise<void> {
    await this.connection.query(
      'INSERT INTO `role_menu` (`id`, `server_id`, `channel_id`, `message_id`, `entries`, `message`, `name`) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [id, serverId, channelId, messageId, JSON.stringify(entries), message, name],
    );
  }

  async getAllForServer(guildId: string): Promise<RoleMenu[]> {
    const result = await this.connection.query('SELECT * FROM `role_menu` WHERE server_id = ?', [guildId]);

    return (result as RoleMenuRow[]).map((row): RoleMenu => {
      let embed = null;
      try {
        embed = JSON.parse(result[0].embed)
      } catch (e) {}

      return {
        id: row.id,
        serverId: row.server_id,
        channelId: row.channel_id,
        messageId: row.message_id,
        entries: JSON.parse(row.entries),
        message: row.message,
        embed,
        name: row.name,
      };
    });
  }

  async getRoleMenuRowById(id: string): Promise<RoleMenu | null> {
    const result = await this.connection.query('SELECT * FROM `role_menu` WHERE id = ?', [id]);

    if (result[0] === undefined) {
      return null;
    }

    let embed = null;
    try {
      embed = JSON.parse(result[0].embed)
    } catch {}

    return {
      id: result[0].id,
      serverId: result[0].server_id,
      channelId: result[0].channel_id,
      messageId: result[0].message_id,
      entries: JSON.parse(result[0].entries),
      message: result[0].message,
      embed,
      name: result[0].name,
    };
  }

  async updateEntry(
    id: string,
    entries: RoleMenuEntry[],
    message: string,
    embed: ReducedEmbed|null,
    messageId: string,
  ): Promise<void> {
    let parsedEmbed: string|null = embed !== null ? JSON.stringify(embed) : '';

    await this.connection.query(
      'UPDATE `role_menu` SET entries = ?, message = ?, embed = ?, message_id = ? WHERE id = ?;',
      [JSON.stringify(entries), message, parsedEmbed, messageId, id],
    );
  }

  async updateMessageId(
    id: string,
    messageId: string,
  ): Promise<void> {
    await this.connection.query(
      'UPDATE `role_menu` SET message_id = ? WHERE id = ?;',
      [messageId, id],
    );
  }

  async removeEntry(
    id: string,
  ): Promise<void> {
    await this.connection.query('DELETE FROM `role_menu` WHERE id = ?', [id]);
  }
}
