import { ReducedChannel, RoleMenu } from '@eve/types/api';
import { Stack, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useState, useCallback } from 'react';
import useUpdateRoleMenu from '../../hooks/useUpdateRoleMenu';
import { FormattedRoles } from '../../types';
import DeleteRoleMenu from '../DeleteRoleMenu';
import DeleteRoleMenuButton from './Inputs/DeleteRoleMenuButton';
import Embed from './Inputs/Embed';
import Message from './Inputs/Message';
import SaveRoleMenuButton from './Inputs/SaveRoleMenuButton';
import SelectedChannel from './Inputs/SelectedChannel';
import RoleMenuRoleList from './RoleMenuRoleList';
import { z } from 'zod';
import { useConfirmLeave } from '@eve/panel/feature/core';

const schema = z.object({
  message: z.string().max(2000),

  entries: z.array(z.object({
    label: z.string().min(1).max(25),

    role: z.string().min(10).max(23),

    color: z.number().min(1).max(4),

    // Change this to an Emoji validator when emoji picker was added to the frontend
    // Should be empty for now
    emoji: z.object({
      name: z.nullable(z.string()),
      id: z.nullable(z.string()),
      animated: z.boolean().optional(),
    }).optional(),
  })),
});

type EditRoleMenuProps = {
  roleMenu: RoleMenu,
  channel: ReducedChannel[],
  formattedRoles: FormattedRoles[],
  updateMenus: () => void,
  serverId: string,
}

export default function EditRoleMenu(
  { roleMenu, channel, formattedRoles, serverId, updateMenus }: EditRoleMenuProps,
) {
  const form = useForm({
    initialValues: roleMenu,
    validateInputOnBlur: true,
    validate: zodResolver(schema),
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { updateRoleMenuError, updateRoleMenu, loading } = useUpdateRoleMenu(serverId);

  const handleDeleteRoleMenuClose = useCallback((shouldUpdateRoleMenus: boolean) => {
    setDeleteDialogOpen(false);
    if (shouldUpdateRoleMenus) {
      updateMenus();
    }
  }, [setDeleteDialogOpen, updateMenus]);

  useConfirmLeave(form);

  return (
    <Stack>
      <DeleteRoleMenu
        opened={deleteDialogOpen}
        roleMenuId={roleMenu.id}
        serverId={serverId}
        close={handleDeleteRoleMenuClose}
      />
      <SelectedChannel form={form} channel={channel} />
      <Message form={form} />
      <Embed form={form} />
      <RoleMenuRoleList form={form} formattedRoles={formattedRoles} />
      <SaveRoleMenuButton form={form} updateRoleMenu={updateRoleMenu} loading={loading} />
      <DeleteRoleMenuButton setDeleteDialogOpen={setDeleteDialogOpen} />
      <Text color={'red'}>{updateRoleMenuError}</Text>
    </Stack>
  );
}
