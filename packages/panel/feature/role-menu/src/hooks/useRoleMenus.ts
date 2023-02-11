import { getAllRoleMenus } from '@eve/panel/feature/core';
import { RoleMenu } from '@eve/types/api';
import { getCookie } from 'cookies-next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface UseRoleMenusData {
  roleMenus: RoleMenu[],
  roleMenuLoading: boolean,
  roleMenuError: string|null,
  setRoleMenus: Dispatch<SetStateAction<RoleMenu[]>>,
  updateRoleMenus: () => void,
}

export default function useRoleMenus(serverId: string, initialRoleMenus: RoleMenu[]): UseRoleMenusData {
  const [roleMenus, setRoleMenus] = useState<RoleMenu[]>(initialRoleMenus);
  const [roleMenuLoading, setRoleMenuLoading] = useState<boolean>(false);
  const [roleMenuError, setRoleMenuError] = useState<string|null>(null);

  async function fetchRoleMenus() {
    const apiKey = String(getCookie('apiKey'));

    setRoleMenuLoading(true);

    const result = await getAllRoleMenus(serverId, apiKey);

    setRoleMenuLoading(false);
    if (typeof result === 'string') {
      setRoleMenuError(result);
      return;
    }

    setRoleMenus(result);
    setRoleMenuError(null);
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
