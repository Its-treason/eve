import { ReactElement, useState } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Ajax } from '@eve/panel/feature/core';

interface CreatePlaylistDialogProps {
  open: boolean,
  close: () => void,
  userId: string,
  name: string,
}

export default function DeletePlaylistDialog(
  { open, close, userId, name }: CreatePlaylistDialogProps,
): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);

  async function deletePlaylist() {
    setLoading(true);
    const body = JSON.stringify({ name });
    const response = await Ajax.post(`/v1/user/${userId}/playlist/delete`, body);
    setLoading(false);
    if (response.error) {
      showNotification({
        title: 'An error occurred while deleting the playlist',
        message: response.error,
        color: 'red',
      });
      return;
    }

    showNotification({
      title: 'Playlist deleted',
      message: `Your playlist "${name}" was successfully deleted!`,
    });
    close();
  }

  return (
    <Modal
      opened={open}
      onClose={close}
      title={'Delete playlist'}
    >
      <Text>Are you sure you want to delete your playlist "{name}"?</Text>
      <Group mt={16} position={'right'}>
        <Button variant={'subtle'} onClick={close}>Cancel</Button>
        <Button
          disabled={loading}
          onClick={deletePlaylist}
          color={'red'}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
