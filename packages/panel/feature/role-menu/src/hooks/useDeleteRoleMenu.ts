import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { deleteRoleMenu as deleteRoleMenuCall } from '@eve/panel/feature/core';

interface UseDeleteRoleMenuData {
  deleteRoleMenuLoading: boolean,
  deleteRoleMenuError: string|null,
  deleteRoleMenu: (roleMenuId: string) => Promise<boolean>,
}

export default function useDeleteRoleMenu(serverId: string): UseDeleteRoleMenuData {
  const [deleteRoleMenuLoading, setDeleteRoleMenuLoading] = useState<boolean>(false);
  const [deleteRoleMenuError, setDeleteRoleMenuError] = useState<string|null>(null);

  async function deleteRoleMenu(roleMenuId: string): Promise<boolean> {
    setDeleteRoleMenuLoading(true);

    const apiKey = String(getCookie('apiKey'));
    const result = await deleteRoleMenuCall(serverId, roleMenuId, apiKey);

    setDeleteRoleMenuLoading(false);
    if (typeof result === 'string') {
      setDeleteRoleMenuError(result);
      return false;
    }

    setDeleteRoleMenuError(null);
    return true;
  }

  return {
    deleteRoleMenuError,
    deleteRoleMenuLoading,
    deleteRoleMenu,
  };
}
