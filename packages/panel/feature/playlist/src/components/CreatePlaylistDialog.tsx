import { ReactElement, useCallback, useMemo, useState } from 'react';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Ajax } from '@eve/panel/feature/core';
import { PlaylistListApiResponseData } from '@eve/types/api';

interface CreatePlaylistDialogProps {
  open: boolean,
  close: () => void,
  playlists: string[],
  userId: string,
}

export default function CreatePlaylistDialog(
  { open, close, playlists, userId }: CreatePlaylistDialogProps,
): ReactElement {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const createPlaylist = useCallback(async () => {
    setLoading(true);
    const body = JSON.stringify({ name, playlistItems: [] });
    const response = await Ajax.post<PlaylistListApiResponseData>(`/v1/user/${userId}/playlist/save`, body);
    setLoading(false);

    setName('');
    close();

    if (response.code !== 200) {
      showNotification({
        title: 'An error occurred while creating the playlist',
        message: response.data,
        color: 'red',
      });
      return;
    }

    showNotification({
      title: 'Playlist created',
      message: `Your playlist "${name}" was successfully created!`,
    });
  }, [name, userId]);

  const nameError = useMemo(() => {
    if (playlists.includes(name)) {
      return 'Playlist already exists!';
    }
    if (name.trim().length === 0) {
      return 'The playlist name must not be empty!';
    }

    return null;
  }, [name, playlists]);

  return (
    <Modal
      opened={open}
      onClose={close}
      title={'Create a new Playlist'}
    >
      <TextInput
        placeholder="Name"
        label="Playlist name"
        value={name}
        onChange={event => setName(event.currentTarget.value)}
        error={nameError}
        required
        disabled={loading}
        autoFocus
      />
      <Group mt={16} position='right'>
        <Button variant={'subtle'} onClick={close}>Cancel</Button>
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
