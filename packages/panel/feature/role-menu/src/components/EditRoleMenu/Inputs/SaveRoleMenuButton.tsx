import { RoleMenu, RoleMenuEntry } from '@eve/core'
import { ReducedEmbed } from '@eve/types/api'
import { Button } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useCallback } from 'react'
import { DeviceFloppy } from 'tabler-icons-react'

type SaveRoleMenuButtonProps = {
  form: UseFormReturnType<RoleMenu>,
  loading: boolean,
  updateRoleMenu: (
    roleMenuId: string, message: string, embed: ReducedEmbed|null, entries: RoleMenuEntry[],
  ) => Promise<boolean>,
}

export default function SaveRoleMenuButton({ form, updateRoleMenu, loading }: SaveRoleMenuButtonProps) {
  const handleClick = useCallback(() => {
    if (!form.isValid()) {
      showNotification({
        title: 'Cannot save',
        message: 'Role menu is invalid and cannot be saved',
      });
      return;
    }

    updateRoleMenu(form.values.id, form.values.message, form.values.embed, form.values.entries).then(() => {
      form.resetDirty();
    });
  }, [form]);

  return (
    <Button
      onClick={handleClick}
      leftIcon={<DeviceFloppy />}
      disabled={!form.isValid() || form.errors['embed'] !== undefined || loading}
    >Save role menu</Button>
  );
}
