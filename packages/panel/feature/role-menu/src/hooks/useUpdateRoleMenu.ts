import { ReducedEmbed, RoleMenuEntry } from '@eve/types/api';
import { useState } from 'react';
import { Ajax } from '@eve/panel/feature/core';
import { showNotification } from '@mantine/notifications';

interface UseUpdateRoleMenuData {
  loading: boolean,
  updateRoleMenuError: string | null,
  updateRoleMenu: (roleMenuId: string, message: string, embed: ReducedEmbed | null, entries: RoleMenuEntry[]) => Promise<boolean>,
}

export default function useUpdateRoleMenu(serverId: string): UseUpdateRoleMenuData {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateRoleMenuError, setUpdateRoleMenuError] = useState<string | null>(null);

  async function updateRoleMenu(
    roleMenuId: string,
    message: string,
    embed: ReducedEmbed | null,
    entries: RoleMenuEntry[],
  ): Promise<boolean> {
    setUpdateRoleMenuError(null);
    setLoading(true);

    const body = JSON.stringify({ message, roleMenu: roleMenuId, entries, embed });
    const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/update`, body);

    setLoading(false);
    if (response.error) {
      setUpdateRoleMenuError(response.error);
      return false;
    }

    showNotification({
      title: 'Saved',
      message: 'Role menu was saved successfully',
    });
    return true;
  }

  return {
    updateRoleMenuError,
    loading,
    updateRoleMenu,
  };
}
