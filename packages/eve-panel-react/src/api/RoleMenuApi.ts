import {RoleMenu, RoleMenuEntry} from "./sharedApiTypes";
import Ajax from "./Ajax";

export async function createRoleMenu(serverId: string, name: string, channelId: string): Promise<true|string> {
  const body = JSON.stringify({ name, channelId });
  const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/create`, body);

  if (response.code !== 200) {
    return response.error ?? 'Unknown Error';
  }

  return true;
}

export async function updateRoleMenu(
  serverId: string,
  roleMenuId: string,
  message: string,
  entries: RoleMenuEntry[],
): Promise<true|string> {
  const body = JSON.stringify({ message, id: roleMenuId, entries });
  const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/update`, body);

  if (response.code !== 200) {
    return response.error ?? 'Unknown Error';
  }

  return true;
}

export async function deleteRoleMenu(serverId: string, roleMenuId: string): Promise<true|string> {
  const body = JSON.stringify({ id: roleMenuId });
  const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/delete`, body);

  if (response.code !== 200) {
    return response.error ?? 'Unknown Error';
  }

  return true;
}

export async function getAllRoleMenus(serverId: string): Promise<RoleMenu[]|string> {
  const response = await Ajax.get(`/v1/server/${serverId}/roleMenu/getAll`);

  if (response.code !== 200) {
    return response.error ?? 'Unknown Error';
  }

  return response.data.data;
}
