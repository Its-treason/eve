import {useState} from "react";
import {updateRoleMenu as updateRoleMenuCall} from "../../../api/RoleMenuApi";
import {RoleMenuEntry} from "../../../api/sharedApiTypes";

interface UseUpdateRoleMenuData {
  updateRoleMenuLoading: boolean,
  updateRoleMenuError: string|null,
  updateRoleMenu: (roleMenuId: string, message: string, entries: RoleMenuEntry[]) => Promise<boolean>,
}

export default function useUpdateRoleMenu(serverId: string): UseUpdateRoleMenuData {
  const [updateRoleMenuLoading, setUpdateRoleMenuLoading] = useState<boolean>(false);
  const [updateRoleMenuError, setUpdateRoleMenuError] = useState<string|null>(null);

  async function updateRoleMenu(
    roleMenuId: string,
    message: string,
    entries: RoleMenuEntry[],
  ): Promise<boolean> {
    if (serverId === '') {
      return;
    }

    setUpdateRoleMenuLoading(true);

    const result = await updateRoleMenuCall(serverId, roleMenuId, message, entries);

    setUpdateRoleMenuLoading(false);
    if (typeof result === "string") {
      setUpdateRoleMenuError(result);
      return false;
    }

    setUpdateRoleMenuError(null);
    return true;
  }

  return {
    updateRoleMenuError,
    updateRoleMenuLoading,
    updateRoleMenu,
  }
}
