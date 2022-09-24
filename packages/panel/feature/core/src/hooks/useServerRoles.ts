import { ReducedRole } from '@eve/types/api';
import { getCookie } from 'cookies-next';
import {useEffect, useState} from "react";
import { getRoles } from '../api/ServerApi';

interface UseServerRolesData {
  roles: ReducedRole[],
  rolesLoading: boolean,
  rolesError: string|null,
  fetchRoles: () => Promise<void>,
}

function useServerRoles(serverId: string): UseServerRolesData {
  const [roles, setRoles] = useState<ReducedRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string|null>(null);

  async function fetchRoles() {
    setRolesLoading(true);

    const apiKey = String(getCookie('apiKey'));
    let newRoles = await getRoles(serverId, apiKey);

    if (typeof newRoles === 'string') {
      setRolesError(newRoles);
      setRolesLoading(false);
      return;
    }

    setRoles(newRoles);
    setRolesError(null);
    setRolesLoading(false);
  }

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
