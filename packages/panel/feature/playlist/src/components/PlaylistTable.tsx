import React, { ReactElement, useCallback, useMemo } from 'react';
import { Table, Button } from '@mantine/core';
import { useRouter } from 'next/router';

interface PlaylistTableProps {
  playlists: string[],
  userId: string,
  setDeleteDialogOpen: (open: false|string) => void,
}

export default function PlaylistTable(
  { playlists, userId, setDeleteDialogOpen }: PlaylistTableProps,
): ReactElement {
  const router = useRouter();

  const editPlaylist = useCallback((playlist: string) => {
    router.push(`/user/${userId}/playlist/${playlist}`);
  }, [userId, router]);
  const deletePlaylist = useCallback((playlist: string) => {
    setDeleteDialogOpen(playlist);
  }, []);

  const tableRows = useMemo(() => {
    return playlists.map((playlist) => {
      return (
        <tr key={playlist}>
          <td style={{ width: '100%' }}>{playlist}</td>
          <td>
            <Button onClick={() => editPlaylist(playlist)}>Edit</Button>
          </td>
          <td>
            <Button color={'red'} onClick={() => deletePlaylist(playlist)}>Delete</Button>
          </td>
        </tr>
      );
    });
  }, [playlists]);

  return (
    <Table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </Table>
  );
}
