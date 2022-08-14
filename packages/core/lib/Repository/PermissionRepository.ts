import { injectable } from 'tsyringe';
import MySQLClient from '../MySQLClient';

@injectable()
export default class PermissionRepository {
  constructor(
    private connection: MySQLClient,
  ) {}

  async isUserAdmin(userId: string): Promise<boolean> {
    const result = await this.connection.query(
      'SELECT user_id FROM permission WHERE user_id = ?',
      [userId],
    );
  
    return result[0]?.user_id === userId;
  }
}
