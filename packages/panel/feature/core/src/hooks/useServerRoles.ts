'use client';

import { ReducedRole, RoleListApiResponseData } from '@eve/types/api';
import { useCallback, useEffect, useState } from 'react';
import Ajax from '../api/Ajax';

interface UseServerRolesData {
  roles: ReducedRole[],
  rolesLoading: boolean,
  rolesError: string | null,
  fetchRoles: () => Promise<void>,
}

function useServerRoles(serverId: string): UseServerRolesData {
  const [roles, setRoles] = useState<ReducedRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setRolesError(null);

    setRolesLoading(true);
    const response = await Ajax.get<RoleListApiResponseData>(`/v1/server/${serverId}/roleList`);
    setRolesLoading(false);

    if (!response.data) {
      setRolesError(response.error);
      setRolesLoading(false);
      return;
    }

    setRoles(response.data);
  }, [serverId]);

  useEffect(() => {
    fetchRoles();
  }, [serverId]);

  return {
    roles,
    rolesError,
    rolesLoading,
    fetchRoles,
  };
}

export default useServerRoles;
