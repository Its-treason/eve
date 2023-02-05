import { MySQLClient } from '@eve/core';
import { singleton } from 'tsyringe';
import MigrationControllerInterface from './MigrationControllerInterface';

@singleton()
export default class MigrationController2 implements MigrationControllerInterface {
  constructor(
    private mysqlClient: MySQLClient,
  ) {}

  async doMigrate(): Promise<void> {
    await this.renameAutoActionsToServerSettings();
  }

  async renameAutoActionsToServerSettings() {
    await this.mysqlClient.query('RENAME TABLE auto_actions TO server_settings');
    await this.mysqlClient.query('ALTER TABLE `server_settings` CHANGE `action` `setting` VARCHAR(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;');
  }
}
