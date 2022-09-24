import { ReactElement, useMemo } from 'react';
import DisplayPlaylistItem from './DisplayPlaylistItem';
import { Table, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { EmptyState } from '@eve/panel/feature/core';
import { PlaylistItem } from '@eve/types/api';
import { Trash, TrashX } from 'tabler-icons-react';

interface PlaylistItemTableProps {
  playlistItems: PlaylistItem[],
  remove: (index: number) => void,
  addSongs: () => void,
}

export default function PlaylistItemTable({ playlistItems, remove, addSongs }: PlaylistItemTableProps): ReactElement {
  const items = useMemo(() => {
    return playlistItems.map((item, index) => {
      return (
        <tr key={index}>
          <td><DisplayPlaylistItem item={item} /></td>
          <td>
            <Button
              leftIcon={<Trash />}
              color={'red'}
              onClick={() => {
                showNotification({
                  title: 'Song removed',
                  message: `Removed "${item.title}" from your Playlist`,
                  color: 'red',
                  icon: <TrashX />
                });
                remove(index);
              }}
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    })
  }, [playlistItems]);

  if (items.length === 0) {
    return (
      <EmptyState 
        text={'Your playlist is currently empty'}
        subText={'Start by adding your favourite songs to this playlist!'}
        action={{
          text: 'Add songs',
          callback: addSongs,
        }}
      />
    );
  }

  return (
    <Table>
      <thead>
      <tr>
        <th style={{ width: '100%' }}>Name</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {items}
      </tbody>
    </Table>
  );
}
