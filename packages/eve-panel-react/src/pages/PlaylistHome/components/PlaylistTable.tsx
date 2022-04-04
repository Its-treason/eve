import React, { ReactElement } from 'react';
import { Table } from '@mantine/core';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface PlaylistTableProps {
  playlists: string[],
  userId: string,
  setDeleteDialogOpen: (open: false|string) => void,
}

export default function PlaylistTable(
  { playlists, userId, setDeleteDialogOpen }: PlaylistTableProps,
): ReactElement {
  const navigate = useNavigate();

  return (
    <Table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
      {playlists.map((playlist) => {
        return (
          <tr key={playlist}>
            <td style={{ width: '100%' }}>
              {playlist}
            </td>
            <td>
              <Button onClick={() => navigate(`/user/${userId}/playlist/${playlist}/edit`)}>Edit</Button>
            </td>
            <td>
              <Button color={'red'} onClick={() => setDeleteDialogOpen(playlist)}>Delete</Button>
            </td>
          </tr>
        );
      })}
      </tbody>
    </Table>
  );
}
