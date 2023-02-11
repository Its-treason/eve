import { ReducedEmbed, RoleMenu, RoleMenuEntry } from '@eve/types/api';
import Ajax from './Ajax';

export async function createRoleMenu(
  serverId: string, name: string, channel: string, apiKey: string,
): Promise<true|string> {
  const body = JSON.stringify({ name, channel });
  const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/create`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}

export async function updateRoleMenu(
  serverId: string,
  roleMenuId: string,
  message: string,
  embed: ReducedEmbed|null,
  entries: RoleMenuEntry[],
  apiKey: string,
): Promise<true|string> {
  const body = JSON.stringify({ message, roleMenu: roleMenuId, entries, embed });
  const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/update`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}

export async function deleteRoleMenu(serverId: string, roleMenuId: string, apiKey: string): Promise<true|string> {
  const body = JSON.stringify({ roleMenu: roleMenuId });
  const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/delete`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}

export async function getAllRoleMenus(serverId: string, apiKey: string): Promise<RoleMenu[]|string> {
  const response = await Ajax.get<RoleMenu[]>(`/v1/server/${serverId}/roleMenu/getAll`, {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}
