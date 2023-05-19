/* eslint-disable camelcase */
import { Client } from '@elastic/elasticsearch';
import { MySQLClient } from '@eve/core';
import { APIPartialEmoji, ButtonStyle } from 'discord-api-types/v9';
import { singleton } from 'tsyringe';
import MigrationControllerInterface from './MigrationControllerInterface';

type RoleMenuEntry = {
  role: string,
  label: string,
  color: ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger
  emoji?: APIPartialEmoji,
}

type ReducedEmbed = {
  title: string,
  description: string,
  color: string,
  footer: string,
  fields: ReducedEmbedField[],
}

type ReducedEmbedField = {
  name: string,
  value: string,
  inline: boolean,
}

type RoleMenu = {
  id: string,
  serverId: string,
  channelId: string,
  messageId: string,
  entries: RoleMenuEntry[],
  message: string,
  embed: ReducedEmbed | null,
  name: string,
}

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
export default class MigrationController2 implements MigrationControllerInterface {
  constructor(
    private mysqlClient: MySQLClient,
    private elasticClient: Client,
  ) { }

  async doMigrate(): Promise<void> {
    await this.moveRoleMenuesToElasticSearch();
    await this.createPublicLogsIndex();
  }

  private async createPublicLogsIndex(): Promise<void> {
    await this.elasticClient.indices.putIndexTemplate({
      name: 'eve-public-logs',
      template: {
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
      },
      data_stream: {
        hidden: false,
      },
      'index_patterns': [
        'eve-public-logs',
      ],
    });
  }

  private async moveRoleMenuesToElasticSearch(): Promise<void> {
    await this.elasticClient.indices.putIndexTemplate({
      name: 'role-menus',
      template: {
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
      },
      index_patterns: ['role-menus'],
    });
    // Create the index
    await this.elasticClient.indices.create({ index: "role-menus" });

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
        embed: row.embed !== '[]' ? JSON.parse(row.embed) : null,
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
