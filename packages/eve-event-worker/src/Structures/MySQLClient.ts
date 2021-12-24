import { createPool, Pool, QueryOptions } from 'mariadb';

export default class MySQLClient {
  private readonly pool: Pool;

  constructor(
    hostname: string,
    username: string,
    password: string,
    database: string,
    port = 3306,
  ) {
    this.pool = createPool({
      host: hostname,
      user: username,
      password: password,
      database: database,
      port: port,
    });
  }

  public async query(sql: string | QueryOptions, values?: string[]): Promise<Record<string, string>[]> {
    return await this.pool.query(sql, values);
  }
}
