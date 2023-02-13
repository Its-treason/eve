/* eslint-disable camelcase */
import { Client } from '@elastic/elasticsearch';
import { MySQLClient, RoleMenu } from '@eve/core';
import { singleton } from 'tsyringe';
import MigrationControllerInterface from './MigrationControllerInterface';

type RoleMenuRow = {
  id: string,
  server_id: string,
  channel_id: string,
  message_id: string,
  entries: string,
  message: string,
  embed: string,
  name: string,
}

@singleton()
export default class MigrationController1 implements MigrationControllerInterface {
  constructor(
    private mysqlClient: MySQLClient,
    private elasticClient: Client,
  ) {}

  async doMigrate(): Promise<void> {
    await this.moveRoleMenuesToElasticSearch();
    await this.createPublicLogsIndex();
  }

  private async createPublicLogsIndex(): Promise<void> {
    await this.elasticClient.indices.putTemplate({
      name: 'eve-public-logs',
      settings: {
        index: {
          lifecycle: {
            name: '30-days-default',
          },
        },
      },
      mappings: {
        'dynamic': 'false',
        'properties': {
          'timestamp': {
            'type': 'date',
          },
          'categorie': {
            'type': 'keyword',
          },
          'message': {
            'type': 'text',
          },
          'relatedServer': {
            'type': 'keyword',
          },
          'relatedUser': {
            'type': 'keyword',
          },
        },
      },
      'index_patterns': [
        'eve-public-logs',
      ],
    });
  }

  private async moveRoleMenuesToElasticSearch(): Promise<void> {
    // Create the Index mapping
    this.elasticClient.indices.putTemplate({
      name: 'role-menus',
      mappings: {
        'dynamic': false,
        'numeric_detection': false,
        '_source': {
          'enabled': true,
        },
        'dynamic_templates': [],
        'properties': {
          'id': {
            'type': 'keyword',
          },
          'serverId': {
            'type': 'keyword',
          },
          'channelId': {
            'type': 'keyword',
          },
          'messageId': {
            'type': 'keyword',
          },
          'message': {
            'type': 'text',
          },
          'entries': {
            'type': 'object',
            'properties': {
              'role': {
                'type': 'keyword',
              },
              'label': {
                'type': 'text',
              },
              'color': {
                'type': 'byte',
              },
              'emoji': {
                'type': 'object',
                'properties': {
                  'id': {
                    'type': 'keyword',
                  },
                  'name': {
                    'type': 'keyword',
                  },
                  'animated': {
                    'type': 'boolean',
                  },
                },
              },
            },
          },
          'name': {
            'type': 'keyword',
          },
          'embed': {
            'type': 'object',
            'properties': {
              'title': {
                'type': 'text',
              },
              'description': {
                'type': 'text',
              },
              'color': {
                'type': 'text',
              },
              'footer': {
                'type': 'text',
              },
              'fields': {
                'type': 'object',
                'properties': {
                  'name': {
                    'type': 'text',
                  },
                  'value': {
                    'type': 'text',
                  },
                  'inline': {
                    'type': 'boolean',
                  },
                },
              },
            },
          },
        },
      },
      index_patterns: ['role-menus'],
    });

    // Collect all Role-Menus
    const result = await this.mysqlClient.query('SELECT * FROM `role_menu`');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const roleMenus = result.map((row: RoleMenuRow): RoleMenu => {
      return {
        id: row.id,
        serverId: row.server_id,
        channelId: row.channel_id,
        messageId: row.message_id,
        entries: JSON.parse(row.entries),
        message: row.message,
        embed: JSON.parse(row.embed),
        name: row.name,
      };
    });

    // Insert them into ES
    for (const roleMenu of roleMenus) {
      await this.elasticClient.index({
        index: 'role-menus',
        document: roleMenu,
        id: roleMenu.id,
        refresh: true,
      });
    }
  }
}
