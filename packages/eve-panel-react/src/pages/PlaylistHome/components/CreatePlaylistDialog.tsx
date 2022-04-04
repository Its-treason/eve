import React, { ReactElement, useEffect, useState } from 'react';
import PlaylistApi from '../../../api/PlaylistApi';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { useHotkeys } from '@mantine/hooks';

interface CreatePlaylistDialogProps {
  open: boolean,
  close: () => void,
  playlists: string[],
  userId: string,
}

export default function CreatePlaylistDialog(
  { open, close, playlists, userId }: CreatePlaylistDialogProps,
): ReactElement {
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const notification = useNotifications();

  async function createPlaylist() {
    setLoading(true);
    const answer = await PlaylistApi.savePlaylist(userId, name, []);
    setLoading(false);
    if (answer !== true) {
      notification.showNotification({
        title: 'An error occurred while creating the playlist',
        message: answer,
        color: 'red',
      });
      setName('');
      close();
      return;
    }

    notification.showNotification({
      title: 'Playlist created',
      message: `Your playlist "${name}" was successfully created!`,
    });
    setName('');
    close();
  }

  useEffect(() => {
    if (playlists.includes(name)) {
      setNameError('Playlist already exists!');
      return;
    }
    if (name.trim().length === 0) {
      setNameError('The playlist name must not be empty!');
      return;
    }

    setNameError(null);
  }, [name, playlists]);

  useHotkeys([
    ['enter', () => {
      if (nameError !== null || loading) {
        return;
      }

      createPlaylist();
    }],
  ]);

  return (
    <Modal
      opened={open}
      onClose={close}
      title={'Create a new Playlist'}
    >
      <TextInput
        placeholder="Name"
        label="Playlist Name"
        value={name}
        onChange={event => setName(event.currentTarget.value)}
        error={nameError}
        required
        disabled={loading}
      />
      <Group grow style={{ marginTop: '10px' }}>
        <Button variant={'outline'} onClick={close}>Cancel</Button>
        <Button
          disabled={nameError !== null || loading}
          onClick={createPlaylist}
        >
          Create
        </Button>
      </Group>
    </Modal>
  );
}
