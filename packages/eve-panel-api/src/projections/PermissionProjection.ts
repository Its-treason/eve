import getConnection from '../structures/getConnection';

export default class PermissionProjection {
  static async isUserAdmin(userId: string): Promise<boolean> {
    const result = await getConnection().query(
      'SELECT user_id FROM permission WHERE user_id = ?',
      [userId],
    );
  
    return result[0] !== undefined;
  }
}
