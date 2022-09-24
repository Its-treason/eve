import { ReactElement, useState } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { deletePlaylist as doDeletePlaylist } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';
import { Trash, TrashX } from 'tabler-icons-react';

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
    const apiKey = String(getCookie('apiKey'));

    setLoading(true);
    const answer = await doDeletePlaylist(userId, name, apiKey);
    setLoading(false);
    if (answer !== true) {
      showNotification({
        title: 'An error occurred while deleting the playlist',
        message: answer,
        color: 'red',
      });
      close();
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
      title={'Delete a Playlist'}
    >
      <Text>Are you sure you want to delete your playlist "{name}"? The playlist will then be gone forever.</Text>
      <Group grow mt={16}>
        <Button variant={'outline'} onClick={close}>Cancel</Button>
        <Button
          leftIcon={<Trash />}
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
