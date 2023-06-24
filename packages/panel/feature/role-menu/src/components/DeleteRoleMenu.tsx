import { ReactElement } from 'react';
import { Button, Text, Modal, Group } from '@mantine/core';
import useDeleteRoleMenu from '../hooks/useDeleteRoleMenu';

interface DeleteRoleMenuProps {
  opened: boolean,
  serverId: string,
  roleMenuId: string,
  close: (updateRoleMenus: boolean) => void,
}

function DeleteRoleMenu({ opened, close, serverId, roleMenuId }: DeleteRoleMenuProps): ReactElement {
  const { deleteRoleMenuError, deleteRoleMenu, deleteRoleMenuLoading } = useDeleteRoleMenu(serverId);

  function cancelDelete() {
    close(false);
  }

  return (
    <Modal opened={opened} onClose={cancelDelete} title={'Delete role menu'}>
      <Group>
        <Text color={'dimmed'}>In case the message is not deleted, you can just delete it on your own</Text>
        <Text color={'red'}>{deleteRoleMenuError}</Text>
        <Button
          ml={'auto'}
          variant={'subtle'}
          disabled={deleteRoleMenuLoading}
          onClick={cancelDelete}
        >Cancel</Button>
        <Button
          color={'red'}
          disabled={deleteRoleMenuLoading}
          onClick={() => deleteRoleMenu(roleMenuId).then(result => {
            if (result) {
              close(true);
            }
          })}
        >Delete</Button>
      </Group>
    </Modal>
  );
}

export default DeleteRoleMenu;
