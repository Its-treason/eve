import { injectable } from 'tsyringe';
import ServerSettingInterface from '../ServerSettings/AbstractServerSetting';
import ActionFactory from '../ServerSettings/ServerSettingFactory';
import MySQLClient from '../MySQLClient';
import AbstractServerSetting from '../ServerSettings/AbstractServerSetting';

@injectable()
export default class ServerSettingsRepository {
  constructor(
    private connection: MySQLClient,
    private actionFactory: ActionFactory,
  ) {}

  public async getSetting(serverId: string, setting: string): Promise<AbstractServerSetting> {
    const sql = 'SELECT payload FROM server_settings WHERE setting = ? AND server_id = ?';
    const result = await this.connection.query(sql, [setting, serverId]);

    if (!result[0]) {
      return this.actionFactory.createEmpty(setting);
    }

    return this.actionFactory.createAction(setting, JSON.parse(result[0].payload));
  }

  public async saveSetting(serverId: string, setting: AbstractServerSetting): Promise<void> {
    const sql = `
      INSERT INTO server_settings (setting, server_id, payload)
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE payload = ?
    `;

    const payload = JSON.stringify(setting.getPayload());
    await this.connection.query(sql, [setting.getSettingName(), serverId, payload, payload]);
  }
}
