import React, { ReactElement, useState } from 'react';
import PlaylistApi from '../../../api/PlaylistApi';
import { Button, Group, Modal, Text } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';

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
  const notification = useNotifications();

  async function deletePlaylist() {
    setLoading(true);
    const answer = await PlaylistApi.deletePlaylist(userId, name);
    setLoading(false);
    if (answer !== true) {
      notification.showNotification({
        title: 'An error occurred while deleting the playlist',
        message: answer,
        color: 'red',
      });
      close();
      return;
    }

    notification.showNotification({
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
      <Text>Are you sure you want to delete "{name}"? The playlist will then be gone forever.</Text>
      <Group grow style={{ marginTop: '10px' }}>
        <Button variant={'outline'} onClick={close}>Cancel</Button>
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
