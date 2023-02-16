import { MySQLClient } from '@eve/core';
import { singleton } from 'tsyringe';

@singleton()
export default class MigrationSettingsRepository {
  constructor(
    private mysqlClient: MySQLClient,
  ) {}

  public async getCurrentMigration(): Promise<number> {
    let settingsResult;
    try {
      settingsResult = await this.mysqlClient.query('SELECT value FROM settings WHERE name = "_db_migration"');
    } catch {
      return 0;
    }
    if (settingsResult.length === 0) {
      return 0;
    }

    return Number(settingsResult[0].value);
  }

  public async updateDbMigrationVersion(version: number): Promise<void> {
    const query = `
      INSERT INTO settings
        (name, value)
      VALUES
        ('_db_migration', ?)
      ON DUPLICATE KEY UPDATE value = ?;
    `;

    await this.mysqlClient.query(query, [String(version), String(version)]);
  }
}
