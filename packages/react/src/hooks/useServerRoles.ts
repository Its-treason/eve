import {ReducedRole} from "../api/sharedApiTypes";
import {useEffect, useState} from "react";
import ServerApi from "../api/ServerApi";

interface UseServerRolesData {
  roles: ReducedRole[],
  rolesLoading: boolean,
  rolesError: string|null,
  fetchRoles: () => Promise<void>,
}

function useServerRoles(serverId: string): UseServerRolesData {
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);

  async function fetchRoles() {
    if (serverId === '') {
      return;
    }

    setRolesLoading(true);

    let newRoles = await ServerApi.getRoles(serverId);

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
    fetchRoles().catch((e) => {
      console.error('Error while fetching roles', e);
      setRolesError('An error occurred while fetching roles');
    });
  }, [serverId]);

  return {
    roles,
    rolesError,
    rolesLoading,
    fetchRoles,
  };
}

export default useServerRoles;
