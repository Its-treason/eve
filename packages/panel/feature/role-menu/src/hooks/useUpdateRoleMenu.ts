import { RoleMenuEntry } from '@eve/types/api';
import {useState} from "react";
import { updateRoleMenu as doUpdateRoleMenu } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';

interface UseUpdateRoleMenuData {
  updateRoleMenuLoading: boolean,
  updateRoleMenuError: string|null,
  updateRoleMenu: (roleMenuId: string, message: string, entries: RoleMenuEntry[]) => Promise<boolean>,
}

export default function useUpdateRoleMenu(serverId: string): UseUpdateRoleMenuData {
  const [updateRoleMenuLoading, setUpdateRoleMenuLoading] = useState<boolean>(false);
  const [updateRoleMenuError, setUpdateRoleMenuError] = useState<string|null>(null);

  async function updateRoleMenu(
    roleMenuId: string,
    message: string,
    entries: RoleMenuEntry[],
  ): Promise<boolean> {
    const apiKey = String(getCookie('apiKey'));

    setUpdateRoleMenuLoading(true);

    const result = await doUpdateRoleMenu(serverId, roleMenuId, message, entries, apiKey);

    setUpdateRoleMenuLoading(false);
    if (typeof result === "string") {
      setUpdateRoleMenuError(result);
      return false;
    }

    setUpdateRoleMenuError(null);
    return true;
  }

  return {
    updateRoleMenuError,
    updateRoleMenuLoading,
    updateRoleMenu,
  }
}
