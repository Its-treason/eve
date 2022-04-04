import {useState} from "react";
import {deleteRoleMenu as deleteRoleMenuCall} from "../../../api/RoleMenuApi";

interface UseDeleteRoleMenuData {
  deleteRoleMenuLoading: boolean,
  deleteRoleMenuError: string|null,
  deleteRoleMenu: (roleMenuId: string) => Promise<boolean>,
}

export default function useDeleteRoleMenu(serverId: string): UseDeleteRoleMenuData {
  const [deleteRoleMenuLoading, setDeleteRoleMenuLoading] = useState<boolean>(false);
  const [deleteRoleMenuError, setDeleteRoleMenuError] = useState<string|null>(null);

  async function deleteRoleMenu(roleMenuId: string): Promise<boolean> {
    if (serverId === '') {
      return;
    }

    setDeleteRoleMenuLoading(true);

    const result = await deleteRoleMenuCall(serverId, roleMenuId);

    setDeleteRoleMenuLoading(false);
    if (typeof result === "string") {
      setDeleteRoleMenuError(result);
      return false;
    }

    setDeleteRoleMenuError(null);
    return true;
  }

  return {
    deleteRoleMenuError,
    deleteRoleMenuLoading,
    deleteRoleMenu,
  }
}
