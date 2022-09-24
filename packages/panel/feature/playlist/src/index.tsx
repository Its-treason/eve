import { ReactElement, useState } from 'react';
import useListPlaylist from './hooks/useListPlaylist';
import { ActionIcon, Button, Divider, Title, Tooltip } from '@mantine/core';
import CreatePlaylistDialog from './components/CreatePlaylistDialog';
import DeletePlaylistDialog from './components/DeletePlaylistDialog';
import PlaylistTable from './components/PlaylistTable';
import { ReducedUser } from '@eve/types/api';
import { EmptyState, Loading } from '@eve/panel/feature/core';
import DisplayInvalidPlaylistError from './components/DisplayInvalidPlaylistError';
import { Plus } from 'tabler-icons-react';

type PlaylistHomeProps = {
  user: ReducedUser,
  initialPlaylists: string[],
  showInvalidPlaylistError: boolean,
}

export default function PlaylistHome(
  { user, initialPlaylists, showInvalidPlaylistError }: PlaylistHomeProps,
): ReactElement {
  const { playlists, loading, loadPlaylist } = useListPlaylist(user.id, initialPlaylists);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<false|string>(false);

  const closeCreateDialog = async () => {
    setCreateDialogOpen(false);
    await loadPlaylist();
  };

  const closeDeleteDialog = async () => {
    setDeleteDialogOpen(false);
    await loadPlaylist();
  };

  return (
    <>
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
      <Title>Playlists</Title>
      {showInvalidPlaylistError && <DisplayInvalidPlaylistError />}
      <Divider
        labelPosition={'right'}
        label={
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            leftIcon={<Plus />}
          >
            Create new Playlist
          </Button>
        }
      />
      {loading ?
        <Loading /> :
        playlists.length === 0 ? (
          <EmptyState
            text={'You don\'t have any playlists'}
            subText={'Start by creating a new playlist'}
            action={{
              callback: () => setCreateDialogOpen(true),
              text: 'Create new Playlist'
            }}
          />
        ) : (
          <PlaylistTable
            playlists={playlists}
            userId={user.id}
            setDeleteDialogOpen={setDeleteDialogOpen}
          />
        ) 
      }
    </>
  );
}
