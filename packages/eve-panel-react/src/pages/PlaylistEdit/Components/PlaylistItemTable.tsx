import { ReactElement } from 'react';
import DisplayPlaylistItem from './DisplayPlaylistItem';
import { Group, Table, Button, Text, Divider } from '@mantine/core';
import { PlaylistItem } from '../../../api/sharedApiTypes';
import { useNotifications } from '@mantine/notifications';

interface PlaylistItemTableProps {
  playlistItems: PlaylistItem[],
  remove: (index: number) => void,
}

export default function PlaylistItemTable({ playlistItems, remove }: PlaylistItemTableProps): ReactElement {
  const notifications = useNotifications();

  if (playlistItems.length === 0) {
    return (
      <Group style={{ width: '100%' }} position={'center'} direction={'column'}>
        <Divider style={{ margin: '2px 0' }} />
        <Text>This playlist is empty</Text>
      </Group>
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
      {playlistItems.map((item, index) => {
        return (
          <tr key={index}>
            <td><DisplayPlaylistItem item={item} /></td>
            <td>
              <Button
                color={'red'}
                onClick={() => {
                  notifications.showNotification({
                    title: 'Song deleted',
                    message: `Deleted "${item.title}" from the Playlist`,
                    color: 'red',
                  });
                  remove(index);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      })}
      </tbody>
    </Table>
  );
}
