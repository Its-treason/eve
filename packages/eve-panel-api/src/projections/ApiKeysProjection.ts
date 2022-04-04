import getConnection from '../structures/getConnection';
import { DiscordAccessToken } from '../types';

export default class ApiKeysProjection {
  static async createApiKey(apiKey: string, accessToken: string, expiresIn: number, tokenType: string): Promise<void> {
    const expirationDate = new Date(Date.now() + expiresIn);

    await getConnection().query(
      'INSERT INTO api_keys (api_key, access_token, expiration_date, token_type) VALUES (?, ?, ?, ?)',
      [
        apiKey,
        accessToken,
        expirationDate.toISOString().slice(0, 19).replace('T', ' '),
        tokenType,
      ],
    );
  }

  static async getAccessTokenByApiKey(apiKey: string): Promise<DiscordAccessToken> {
    const result = await getConnection().query(
      'SELECT access_token, token_type FROM api_keys WHERE api_key = ? AND expiration_date > CURRENT_DATE',
      [apiKey],
    );

    if (result[0] === undefined) {
      return { accessToken: null, tokenType: null };
    }

    return { accessToken: result[0].access_token, tokenType: result[0].token_type };
  }

  static async deleteApiKey(apiKey: string): Promise<void> {
    const sql = 'DELETE FROM api_keys WHERE api_key = ?';

    await getConnection().query(sql, [apiKey]);
  }
}
