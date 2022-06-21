import getConnection from '../structures/getConnection';
import AbstractAutoAction from '../actions/AbstractAutoAction';
import emptyActionFactory from '../actions/factory/emptyActionFactory';
import actionFactory from '../actions/factory/actionFactory';

export default class AutoActionsProjection {
  public static async getActions(serverId: string, type: string): Promise<AbstractAutoAction> {
    const sql = 'SELECT payload FROM auto_actions WHERE action = ? AND server_id = ?';
    const result = await getConnection().query(sql, [type, serverId]);

    if (!result[0]) {
      return emptyActionFactory(type);
    }

    return actionFactory(type, result[0].payload);
  }

  public static async saveActions(serverId: string, action: AbstractAutoAction): Promise<void> {
    const sql = `
      INSERT INTO auto_actions (action, server_id, payload)
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE payload = ?
    `;

    await getConnection().query(sql, [action.getName(), serverId, action.getPayload(), action.getPayload()]);
  }
}
