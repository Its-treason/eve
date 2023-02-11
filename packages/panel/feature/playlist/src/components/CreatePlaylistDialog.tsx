import { ReactElement, useEffect, useState } from 'react';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { savePlaylist } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';

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

  async function createPlaylist() {
    const apiKey = String(getCookie('apiKey'));

    setLoading(true);
    const answer = await savePlaylist(userId, name, [], apiKey);
    setLoading(false);
    if (answer !== true) {
      showNotification({
        title: 'An error occurred while creating the playlist',
        message: answer,
        color: 'red',
      });
      setName('');
      close();
      return;
    }

    showNotification({
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
      <Group mt={16} grow>
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
