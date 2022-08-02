import { injectable } from 'tsyringe';
import AutoActionInterface from '../Actions/AutoActionInterface';
import ActionFactory from '../Actions/ActionFactory';
import MySQLClient from '../MySQLClient';

@injectable()
export default class AutoActionsRepository {
  constructor(
    private connection: MySQLClient,
    private actionFactory: ActionFactory,
  ) {}

  public async getActions(serverId: string, type: string): Promise<AutoActionInterface> {
    const sql = 'SELECT payload FROM auto_actions WHERE action = ? AND server_id';
    const result = await this.connection.query(sql, [type, serverId]);

    if (!result[0]) {
      return this.actionFactory.createEmpty(type);
    }

    return this.actionFactory.createAction(type, result[0].payload);
  }

  public async saveActions(serverId: string, action: AutoActionInterface): Promise<void> {
    const sql = `
      INSERT INTO auto_actions (action, server_id, payload)
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE payload = ?
    `;

    await this.connection.query(sql, [action.getName(), serverId, action.getPayload(), action.getPayload()]);
  }
}
