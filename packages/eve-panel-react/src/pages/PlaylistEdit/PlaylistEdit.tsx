import { useParams } from 'react-router-dom';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { BreadCrumpItem } from '../../types';
import Layout from '../../components/Layout';
import useUserServerFromParams from '../../hooks/useUserServerFromParams';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import usePlaylistItems from './hooks/usePlaylistItems';
import { Group, Text, Button } from '@mantine/core';
import { PlaylistItem } from '../../api/sharedApiTypes';
import { useListState } from '@mantine/hooks';
import AddSongDialog from './Components/AddSongDialog';
import PlaylistItemTable from './Components/PlaylistItemTable';
import Loading from '../../components/Loading';
import PlaylistApi from '../../api/PlaylistApi';
import { useNotifications } from '@mantine/notifications';

export default function PlaylistEdit(): ReactElement {
  const { playlistName } = useParams();
  const { user } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));
  const { fetchedPlaylistItems, loading } = usePlaylistItems(playlistName, user.id);
  const [playlistItems, playlistItemHandler] = useListState<PlaylistItem>([]);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const notifications = useNotifications();

  function closeAddDialog(): void {
    setAddDialogOpen(false);
  }

  useEffect(() => {
    playlistItemHandler.setState(fetchedPlaylistItems);
  }, [fetchedPlaylistItems]);

  async function save(): Promise<void> {
    setSaving(true);
    await PlaylistApi.savePlaylist(user.id, playlistName, playlistItems);
    setSaving(false);
    notifications.showNotification({
      title: 'Playlist saved!',
      message: `Your playlist "${playlistName}" was successfully saved!`,
    });
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home', active: false },
    { label: `Edit: ${user.name}`, to: `/user/${user.id}/home`, active: false },
    { label: 'Playlist', to: `/user/${user.id}/playlist`, active: false },
    { label: `Edit: ${playlistName}`, active: true },
  ];

  return (
    <Layout navItems={navItems}>
      <AddSongDialog
        open={addDialogOpen}
        close={closeAddDialog}
        append={playlistItemHandler.append}
        userId={user.id}
      />
      <Group style={{ position: 'sticky', top: 0, backgroundColor: '#1d1e30' }}>
        <Text>{playlistName}</Text>
        <Button onClick={() => setAddDialogOpen(true)} disabled={saving}>Add Songs</Button>
        <Button onClick={save} disabled={saving}>Save</Button>
      </Group>
      {loading ?
        <Loading /> :
        <PlaylistItemTable playlistItems={playlistItems} remove={playlistItemHandler.remove} />
      }
    </Layout>
  );
}
