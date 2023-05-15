import { useState } from 'react';
import { Ajax } from '@eve/panel/feature/core';

interface UseCreateRoleMenuData {
  createRoleMenuLoading: boolean,
  createRoleMenuError: string | null,
  createRoleMenu: (name: string, channelId: string) => Promise<boolean>,
}

export default function useCreateRoleMenu(serverId: string): UseCreateRoleMenuData {
  const [createRoleMenuLoading, setCreateRoleMenuLoading] = useState<boolean>(false);
  const [createRoleMenuError, setCreateRoleMenuError] = useState<string | null>(null);

  async function createRoleMenu(name: string, channelId: string): Promise<boolean> {
    setCreateRoleMenuError(null);
    setCreateRoleMenuLoading(true);

    const body = JSON.stringify({ name, channel: channelId });
    const response = await Ajax.post(`/v1/server/${serverId}/roleMenu/create`, body);

    setCreateRoleMenuLoading(false);
    if (response.error) {
      setCreateRoleMenuError(response.error);
      return false;
    }

    return true;
  }

  return {
    createRoleMenuError,
    createRoleMenuLoading,
    createRoleMenu,
  };
}
