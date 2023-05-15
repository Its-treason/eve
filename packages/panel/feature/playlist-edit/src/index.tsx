'use client';

import { ReactElement, useCallback, useEffect, useState } from 'react';
import usePlaylistItems from './hooks/usePlaylistItems';
import { Text, Button, Group, Title } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import AddSongDialog from './Components/AddSongDialog';
import PlaylistItemTable from './Components/PlaylistItemTable';
import { showNotification } from '@mantine/notifications';
import { DeviceFloppy, PlaylistAdd } from 'tabler-icons-react';
import { PlaylistItem, ReducedUser } from '@eve/types/api';
import { Ajax, Loading } from '@eve/panel/feature/core';

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
    setSaving(true);
    const body = JSON.stringify({ name: playlistName, playlistItems });
    const response = await Ajax.post(`/v1/user/${user.id}/playlist/save`, body);
    setSaving(false);

    if (response.error) {
      showNotification({
        title: 'Failed to save',
        message: `An error occurred while saving your playlist: ${response.error}`,
        color: 'red',
      });
    }

    showNotification({
      title: 'Playlist saved!',
      message: `Your playlist "${playlistName}" was successfully saved!`,
    });
  }, [user.id, playlistName, playlistItems]);

  const addSongs = useCallback(() => {
    setAddDialogOpen(true);
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
      <Group mt={16}>
        <Button
          leftIcon={<DeviceFloppy />}
          onClick={save}
          disabled={saving}
        >Save</Button>
        <Button
          leftIcon={<PlaylistAdd />}
          onClick={addSongs}
          disabled={saving}
        >Add Songs</Button>
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
