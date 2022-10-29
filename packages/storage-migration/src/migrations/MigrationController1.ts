import { Client } from '@elastic/elasticsearch';
import { MySQLClient, RoleMenu } from '@eve/core';
import { singleton } from 'tsyringe';
import MigrationControllerInterface from './MigrationControllerInterface';

@singleton()
export default class MigrationController1 implements MigrationControllerInterface {
  constructor(
    private mysqlClient: MySQLClient,
    private elasticClient: Client,
  ) {}

  async doMigrate(): Promise<void> {
    await this.moveRoleMenuesToElasticSearch();
  }

  private async moveRoleMenuesToElasticSearch(): Promise<void> {
    // Create the Index mapping
    this.elasticClient.indices.putTemplate({
      name: 'role-menus',
      mappings: {
        "dynamic": false,
        "numeric_detection": false,
        "_source": {
          "enabled": true
        },
        "dynamic_templates": [],
        "properties": {
          "id": {
            "type": "keyword"
          },
          "serverId": {
            "type": "keyword"
          },
          "channelId": {
            "type": "keyword"
          },
          "messageId": {
            "type": "keyword"
          },
          "message": {
            "type": "text"
          },
          "entries": {
            "type": "object",
            "properties": {
              "role": {
                "type": "keyword"
              },
              "label": {
                "type": "text"
              },
              "color": {
                "type": "byte"
              },
              "emoji": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "keyword"
                  },
                  "name": {
                    "type": "keyword"
                  },
                  "animated": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "name": {
            "type": "keyword"
          },
          "embed": {
            "type": "object",
            "properties": {
              "title": {
                "type": "text"
              },
              "description": {
                "type": "text"
              },
              "color": {
                "type": "text"
              },
              "footer": {
                "type": "text"
              },
              "fields": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "text"
                  },
                  "value": {
                    "type": "text"
                  },
                  "inline": {
                    "type": "boolean"
                  }
                }
              }
            }
          }
        }
      },
      index_patterns: ['role-menus'],
    });

    // Collect all Role-Menus
    const result = await this.mysqlClient.query('SELECT * FROM `role_menu`');

    const roleMenus = (result).map((row): RoleMenu => {
      let embed = null;
      try {
        embed = JSON.parse(result[0].embed)
      } catch (e) {}

      return {
        id: row.id,
        serverId: row.server_id,
        channelId: row.channel_id,
        messageId: row.message_id,
        entries: JSON.parse(row.entries),
        message: row.message,
        embed,
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
