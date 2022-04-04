import {RoleMenu} from "../../../api/sharedApiTypes";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {getAllRoleMenus} from "../../../api/RoleMenuApi";

interface UseRoleMenusData {
  roleMenus: RoleMenu[],
  roleMenuLoading: boolean,
  roleMenuError: string|null,
  setRoleMenus: Dispatch<SetStateAction<RoleMenu[]>>,
  updateRoleMenus: () => void,
}

export default function useRoleMenus(serverId: string): UseRoleMenusData {
  const [roleMenus, setRoleMenus] = useState<RoleMenu[]>([]);
  const [roleMenuLoading, setRoleMenuLoading] = useState<boolean>(true);
  const [roleMenuError, setRoleMenuError] = useState<string|null>(null);

  async function fetchRoleMenus() {
    if (serverId === '') {
      return;
    }

    setRoleMenuLoading(true);

    const result = await getAllRoleMenus(serverId);

    setRoleMenuLoading(false);
    if (typeof result === "string") {
      setRoleMenuError(result);
      return;
    }

    setRoleMenus(result);
    setRoleMenuError(null);
  }

  useEffect(() => {
    fetchRoleMenus().catch(console.error);
  }, [serverId])

  return {
    roleMenus,
    roleMenuError,
    roleMenuLoading,
    setRoleMenus,
    updateRoleMenus: () => fetchRoleMenus().catch(console.error),
  }
}
