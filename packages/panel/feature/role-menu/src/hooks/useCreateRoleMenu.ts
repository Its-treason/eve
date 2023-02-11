import { useState } from 'react';
import { createRoleMenu as createRoleMenuCall } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';

interface UseCreateRoleMenuData {
  createRoleMenuLoading: boolean,
  createRoleMenuError: string|null,
  createRoleMenu: (name: string, channelId: string) => Promise<boolean>,
}

export default function useCreateRoleMenu(serverId: string): UseCreateRoleMenuData {
  const [createRoleMenuLoading, setCreateRoleMenuLoading] = useState<boolean>(false);
  const [createRoleMenuError, setCreateRoleMenuError] = useState<string|null>(null);

  async function createRoleMenu(name: string, channelId: string): Promise<boolean> {
    setCreateRoleMenuLoading(true);

    const apiKey = String(getCookie('apiKey'));
    const result = await createRoleMenuCall(serverId, name, channelId, apiKey);

    setCreateRoleMenuLoading(false);
    if (typeof result === 'string') {
      setCreateRoleMenuError(result);
      return false;
    }

    setCreateRoleMenuError(null);
    return true;
  }

  return {
    createRoleMenuError,
    createRoleMenuLoading,
    createRoleMenu,
  };
}
