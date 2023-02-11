import { ReducedEmbed, RoleMenuEntry } from '@eve/types/api';
import { useState } from 'react';
import { updateRoleMenu as doUpdateRoleMenu } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';
import { showNotification } from '@mantine/notifications';

interface UseUpdateRoleMenuData {
  loading: boolean,
  updateRoleMenuError: string|null,
  updateRoleMenu: (roleMenuId: string, message: string, embed: ReducedEmbed|null, entries: RoleMenuEntry[]) => Promise<boolean>,
}

export default function useUpdateRoleMenu(serverId: string): UseUpdateRoleMenuData {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateRoleMenuError, setUpdateRoleMenuError] = useState<string|null>(null);

  async function updateRoleMenu(
    roleMenuId: string,
    message: string,
    embed: ReducedEmbed|null,
    entries: RoleMenuEntry[],
  ): Promise<boolean> {
    const apiKey = String(getCookie('apiKey'));

    setLoading(true);

    const result = await doUpdateRoleMenu(serverId, roleMenuId, message, embed, entries, apiKey);

    setLoading(false);
    if (typeof result === 'string') {
      setUpdateRoleMenuError(result);
      return false;
    }

    showNotification({
      title: 'Saved',
      message: 'Role menu was saved successfully',
    });
    setUpdateRoleMenuError(null);
    return true;
  }

  return {
    updateRoleMenuError,
    loading,
    updateRoleMenu,
  };
}
