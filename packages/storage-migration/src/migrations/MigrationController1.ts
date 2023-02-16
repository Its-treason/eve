/* eslint-disable camelcase */
import { Client } from '@elastic/elasticsearch';
import { MySQLClient } from '@eve/core';
import { singleton } from 'tsyringe';
import MigrationControllerInterface from './MigrationControllerInterface';

@singleton()
export default class MigrationController1 implements MigrationControllerInterface {
  constructor(
    private mysqlClient: MySQLClient,
    private elasticClient: Client,
  ) { }

  async doMigrate(): Promise<void> {
    await this.createTableApiKeys();
    await this.createTableAutoActions();
    await this.createTableChannelActivity();
    await this.createPermissionsTable();
    await this.createRoleMenuTable();
    await this.createSettingsTable();

    await this.createInternalLogsIndex();
  }

  private async createTableApiKeys(): Promise<void> {
    await this.mysqlClient.query(`
      CREATE TABLE api_keys (
        api_key char(64) NOT NULL,
        access_token tinytext NOT NULL,
        expiration_date datetime NOT NULL,
        token_type tinytext NOT NULL,
        PRIMARY KEY (api_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  private async createTableAutoActions(): Promise<void> {
    await this.mysqlClient.query(`
      CREATE TABLE auto_actions (
        action varchar(32) NOT NULL,
        server_id varchar(18) NOT NULL,
        payload longtext NOT NULL,
        PRIMARY KEY (server_id, action)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  private async createTableChannelActivity(): Promise<void> {
    await this.mysqlClient.query(`
      CREATE TABLE channel_activity (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id varchar(19) NOT NULL,
        guild_id varchar(18) NOT NULL,
        channel_id varchar(18) NOT NULL,
        joined_at datetime NOT NULL,
        left_at datetime DEFAULT NULL,
        PRIMARY KEY (id),
        KEY guild_id (guild_id, channel_id),
        KEY user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  private async createPermissionsTable(): Promise<void> {
    await this.mysqlClient.query(`
      CREATE TABLE permission (
        user_id varchar(18) NOT NULL COMMENT 'Discord User ID',
        PRIMARY KEY (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  private async createRoleMenuTable(): Promise<void> {
    await this.mysqlClient.query(`
      CREATE TABLE role_menu (
        id varchar(64) NOT NULL,
        server_id varchar(21) NOT NULL,
        channel_id varchar(21) NOT NULL,
        message_id varchar(21) NOT NULL,
        entries longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
        message text NOT NULL,
        name tinytext NOT NULL,
        PRIMARY KEY (id, server_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  private async createSettingsTable(): Promise<void> {
    await this.mysqlClient.query(`
      CREATE TABLE settings (
        name varchar(32) NOT NULL,
        value varchar(64),
        PRIMARY KEY (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  private async createInternalLogsIndex(): Promise<void> {
    await this.elasticClient.indices.putIndexTemplate({
      name: 'eve-logs',
      index_patterns: ['eve-logs-*'],
      template: {
        mappings: {
          dynamic: true,
          properties: {
            message: {
              type: 'keyword',
            },
            level: {
              type: 'keyword',
            },
            level_name: {
              type: 'keyword',
            },
            channel: {
              type: 'keyword',
            },
            timestamp: {
              type: 'keyword',
            },
            context: {
              type: 'object',
            },
          },
        },
      },
      priority: 500,
    });
  }
}
