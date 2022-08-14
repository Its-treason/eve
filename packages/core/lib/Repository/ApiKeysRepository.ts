import { singleton } from 'tsyringe';
import MySQLClient from '../MySQLClient';
import { DiscordAccessToken } from '../types';

@singleton()
export default class ApiKeysRepository {
  constructor(
    private connection: MySQLClient,
  ) {}

  async createApiKey(apiKey: string, accessToken: string, expiresIn: number, tokenType: string): Promise<void> {
    const expirationDate = new Date(Date.now() + expiresIn);

    await this.connection.query(
      'INSERT INTO api_keys (api_key, access_token, expiration_date, token_type) VALUES (?, ?, ?, ?)',
      [
        apiKey,
        accessToken,
        expirationDate.toISOString().slice(0, 19).replace('T', ' '),
        tokenType,
      ],
    );
  }

  async getAccessTokenByApiKey(apiKey: string): Promise<DiscordAccessToken> {
    const result = await this.connection.query(
      'SELECT access_token, token_type FROM api_keys WHERE api_key = ? AND expiration_date > CURRENT_DATE',
      [apiKey],
    );

    if (result[0] === undefined) {
      return { accessToken: null, tokenType: null };
    }

    return { accessToken: result[0].access_token, tokenType: result[0].token_type };
  }

  async deleteApiKey(apiKey: string): Promise<void> {
    const sql = 'DELETE FROM api_keys WHERE api_key = ?';

    await this.connection.query(sql, [apiKey]);
  }
}
