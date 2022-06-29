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

  public async getActions(serverId: string, type: string): Promise<AutoActionInterface|false> {
    const sql = 'SELECT payload FROM auto_actions WHERE action = ? AND server_id';
    const result = await this.connection.query(sql, [type, serverId]);

    if (!result[0]) {
      return false;
    }

    return this.actionFactory.createAction(type, result[0].payload);
  }
}
