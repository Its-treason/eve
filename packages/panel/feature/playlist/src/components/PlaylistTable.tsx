import { ReactElement, useCallback, useMemo } from 'react';
import { Table, Button } from '@mantine/core';
import { Pencil, Trash } from 'tabler-icons-react';
import Link from 'next/link';

interface PlaylistTableProps {
  playlists: string[],
  userId: string,
  setDeleteDialogOpen: (open: false | string) => void,
}

export default function PlaylistTable(
  { playlists, userId, setDeleteDialogOpen }: PlaylistTableProps,
): ReactElement {
  const deletePlaylist = useCallback((playlist: string) => {
    setDeleteDialogOpen(playlist);
  }, []);

  const tableRows = useMemo(() => {
    return playlists.map((playlist) => {
      return (
        <tr key={playlist}>
          <td style={{ width: '100%' }}>{playlist}</td>
          <td>
            <Button
              component={Link}
              href={`/user/${userId}/playlist/${playlist}`}
              leftIcon={<Pencil />}
            >
              Edit
            </Button>
          </td>
          <td>
            <Button
              variant={'light'}
              leftIcon={<Trash />}
              color={'red'}
              onClick={() => deletePlaylist(playlist)}
            >
              Delete
            </Button>
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
