import { Ajax } from '@eve/panel/feature/core';
import { RoleMenu } from '@eve/types/api';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface UseRoleMenusData {
  roleMenus: RoleMenu[],
  roleMenuLoading: boolean,
  roleMenuError: string | null,
  setRoleMenus: Dispatch<SetStateAction<RoleMenu[]>>,
  updateRoleMenus: () => void,
}

export default function useRoleMenus(serverId: string, initialRoleMenus: RoleMenu[]): UseRoleMenusData {
  const [roleMenus, setRoleMenus] = useState<RoleMenu[]>(initialRoleMenus);
  const [roleMenuLoading, setRoleMenuLoading] = useState<boolean>(false);
  const [roleMenuError, setRoleMenuError] = useState<string | null>(null);

  async function fetchRoleMenus() {
    setRoleMenuError(null);
    setRoleMenuLoading(true);
    const response = await Ajax.get<RoleMenu[]>(`/v1/server/${serverId}/roleMenu/getAll`);
    setRoleMenuLoading(false);
    if (!response.data) {
      setRoleMenuError(response.error);
      setRoleMenus([]);
      return;
    }

    setRoleMenus(response.data);
  }

  useEffect(() => {
    fetchRoleMenus();
  }, [serverId]);

  return {
    roleMenus,
    roleMenuError,
    roleMenuLoading,
    setRoleMenus,
    updateRoleMenus: () => fetchRoleMenus(),
  };
}
