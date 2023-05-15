import { useState } from 'react';
import { Ajax } from '@eve/panel/feature/core';

interface UseDeleteRoleMenuData {
  deleteRoleMenuLoading: boolean,
  deleteRoleMenuError: string | null,
  deleteRoleMenu: (roleMenuId: string) => Promise<boolean>,
}

export default function useDeleteRoleMenu(serverId: string): UseDeleteRoleMenuData {
  const [deleteRoleMenuLoading, setDeleteRoleMenuLoading] = useState<boolean>(false);
  const [deleteRoleMenuError, setDeleteRoleMenuError] = useState<string | null>(null);

  async function deleteRoleMenu(roleMenuId: string): Promise<boolean> {
    setDeleteRoleMenuError(null);
    setDeleteRoleMenuLoading(true);

    const body = JSON.stringify({ roleMenu: roleMenuId });
    const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/delete`, body);

    setDeleteRoleMenuLoading(false);
    if (response.error) {
      setDeleteRoleMenuError(response.error);
      return false;
    }

    return true;
  }

  return {
    deleteRoleMenuError,
    deleteRoleMenuLoading,
    deleteRoleMenu,
  };
}
