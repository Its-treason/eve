import actionFactory from '../Actions/Factory/actionFactory';
import AbstractAutoAction from '../Actions/AbstractAutoAction';
import { injectable } from 'tsyringe';
import MySQLClient from "../Structures/MySQLClient";

@injectable()
export default class AutoActionsProjection {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private connection: MySQLClient,
  ) {}

  public async getActions(serverId: string, type: string): Promise<AbstractAutoAction|false> {
    const sql = 'SELECT payload FROM auto_actions WHERE action = ? AND server_id';
    const result = await this.connection.query(sql, [type, serverId]);

    if (!result[0]) {
      return false;
    }

    return actionFactory(type, result[0].payload);
  }
}
