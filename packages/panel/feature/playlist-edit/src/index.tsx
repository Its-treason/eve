import { ReactElement, useCallback, useEffect, useState } from 'react';
import usePlaylistItems from './hooks/usePlaylistItems';
import { Text, Button, Group, Title } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import AddSongDialog from './Components/AddSongDialog';
import PlaylistItemTable from './Components/PlaylistItemTable';
import { showNotification } from '@mantine/notifications';
import { DeviceFloppy, PlaylistAdd } from 'tabler-icons-react';
import { PlaylistItem, ReducedUser } from '@eve/types/api';
import { Loading, savePlaylist } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';

type PlaylistEditProps = {
  playlistName: string,
  user: ReducedUser,
}

export default function PlaylistEdit({ playlistName, user }: PlaylistEditProps): ReactElement {
  const { fetchedPlaylistItems, loading } = usePlaylistItems(playlistName, user.id);
  const [playlistItems, playlistItemHandler] = useListState<PlaylistItem>([]);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    playlistItemHandler.setState(fetchedPlaylistItems);
  }, [fetchedPlaylistItems]);

  const save = useCallback(async () => {
    const apiKey = String(getCookie('apiKey'));

    setSaving(true);
    await savePlaylist(user.id, playlistName, playlistItems, apiKey);
    setSaving(false);
    showNotification({
      title: 'Playlist saved!',
      message: `Your playlist "${playlistName}" was successfully saved!`,
    });
  }, [])

  const addSongs = useCallback(() => {
    setAddDialogOpen(true)
  }, []);

  return (
    <>
      <AddSongDialog
        open={addDialogOpen}
        close={() => setAddDialogOpen(false)}
        append={playlistItemHandler.append}
        userId={user.id}
      />
      <Title>Edit Playlist</Title>
      <Text>Current Playlist: {playlistName}</Text>
      <Group grow mt={16}>
        <Button
          leftIcon={<PlaylistAdd />}
          onClick={addSongs}
          disabled={saving}
        >Add Songs</Button>
        <Button
          leftIcon={<DeviceFloppy />}
          onClick={save}
          disabled={saving}
        >Save</Button>
      </Group>
      {loading ? (
        <Loading />
      ) : (
        <PlaylistItemTable
          playlistItems={playlistItems}
          remove={playlistItemHandler.remove}
          addSongs={addSongs}
        />
      )}
    </>
  );
}
