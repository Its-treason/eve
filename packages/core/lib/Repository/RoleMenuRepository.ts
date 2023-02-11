import { Client } from '@elastic/elasticsearch';
import { singleton } from 'tsyringe';
import { RoleMenu } from '../types';

@singleton()
export default class RoleMenuRepository {
  constructor(
    private client: Client,
  ) {}

  async saveEntry(
    roleMenu: RoleMenu,
  ): Promise<void> {
    await this.client.index({
      index: 'role-menus',
      document: roleMenu,
      id: roleMenu.id,
      refresh: true,
    });
  }

  async getAllForServer(serverId: string): Promise<RoleMenu[]> {
    const response = await this.client.search<RoleMenu>({
      index: 'role-menus',
      query: {
        match: {
          serverId,
        },
      },
    });

    return response.hits.hits.map((hit) => hit['_source'])
      .filter((hit): hit is RoleMenu => (hit !== undefined && hit !== null));
  }

  async getRoleMenuRowById(id: string): Promise<RoleMenu | null> {
    const response = await this.client.search<RoleMenu>({
      index: 'role-menus',
      query: {
        match: {
          '_id': id,
        },
      },
    });

    if (response.hits.hits.length === 0) {
      return null;
    }
    return response.hits.hits[0]._source ?? null;
  }

  async removeEntry(
    id: string,
  ): Promise<void> {
    await this.client.delete({
      index: 'role-menus',
      id,
      refresh: true,
    });
  }
}
