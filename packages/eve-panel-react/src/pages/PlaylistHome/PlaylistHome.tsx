import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useListPlaylist from './hooks/useListPlaylist';
import Layout from '../../components/Layout';
import { ActionIcon, Container, Divider, Title, Tooltip } from '@mantine/core';
import { BreadCrumpItem } from '../../types';
import useUserServerFromParams from '../../hooks/useUserServerFromParams';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import Loading from '../../components/Loading';
import CreatePlaylistDialog from './components/CreatePlaylistDialog';
import DeletePlaylistDialog from './components/DeletePlaylistDialog';
import PlaylistTable from './components/PlaylistTable';
import { useNotifications } from '@mantine/notifications';

export default function PlaylistHome(): ReactElement {
  const { user } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));
  const { playlists, loading, loadPlaylist } = useListPlaylist(user.id);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<false|string>(false);
  const notifications = useNotifications();
  const location = useLocation();

  const closeCreateDialog = async () => {
    setCreateDialogOpen(false);
    await loadPlaylist();
  };

  const closeDeleteDialog = async () => {
    setDeleteDialogOpen(false);
    await loadPlaylist();
  };

  useEffect(() => {
    if (location.search === '?invalidName=true') {
      notifications.showNotification({
        title: 'Redirected',
        message: 'Looks like you tried to edit a playlist that doesn\'t exist. Because of that you got redirected here.' ,
        autoClose: false,
      });
    }
    window.history.pushState({}, document.title, window.location.pathname);
  }, []);

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home' },
    { label: `Edit: ${user.name}`, to: `/user/${user.id}/home` },
    { label: 'Playlist' },
  ];

  return (
    <Layout navItems={navItems}>
      <CreatePlaylistDialog
        playlists={playlists}
        open={createDialogOpen}
        close={closeCreateDialog}
        userId={user.id}
      />
      <DeletePlaylistDialog
        open={deleteDialogOpen !== false}
        close={closeDeleteDialog}
        userId={user.id}
        name={deleteDialogOpen || ''}
      />
      <Container size={'xs'}>
        <Title>Playlists</Title>
        <Divider
          labelPosition={'right'}
          label={
            <Tooltip label={'Create new Playlist'}>
              <ActionIcon variant="outline" onClick={() => setCreateDialogOpen(true)}>
                <img style={{ width: 16, height: 16 }} src={'/assets/create.png'} alt={'create'} />
              </ActionIcon>
            </Tooltip>
          }
        />
        {loading ?
          <Loading /> :
          <PlaylistTable
            playlists={playlists}
            userId={user.id}
            setDeleteDialogOpen={setDeleteDialogOpen}
          />
        }
      </Container>
    </Layout>
  );
}
