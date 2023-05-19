import { MySQLClient } from '@eve/core';
import { singleton } from 'tsyringe';
import MigrationControllerInterface from './MigrationControllerInterface';

type OldAutoActionPayload = {
  message: string,
  channel: string,
  enabled: true,
}

type NewAutoActionPayload = {
  message: string,
  channel: string,
  enabled: true,
  embed: null,
}

@singleton()
export default class MigrationController4 implements MigrationControllerInterface {
  constructor(
    private mysqlClient: MySQLClient,
  ) { }

  async doMigrate(): Promise<void> {
    await this.addEmbedToAutoActions();
  }

  async addEmbedToAutoActions() {
    const query = "SELECT * FROM `server_settings` WHERE `setting` = 'join-message' OR `setting` = 'leave-message'";

    const updateQuery = "UPDATE `server_settings` SET `payload` = ? WHERE `setting` = ? AND `server_id` = ?";

    const result = await this.mysqlClient.query(query);

    for (const row of result) {
      const oldPayload: OldAutoActionPayload = JSON.parse(row.payload);
      const newPayload: NewAutoActionPayload = { ...oldPayload, embed: null };

      await this.mysqlClient.query(updateQuery, [JSON.stringify(newPayload), row.setting, row.server_id]);
    }
  }
}
