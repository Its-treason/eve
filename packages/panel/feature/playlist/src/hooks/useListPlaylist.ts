import { Ajax } from '@eve/panel/feature/core';
import { PlaylistListApiResponseData } from '@eve/types/api';
import { useState } from 'react';

interface UseListPlaylist {
  playlists: string[],
  loading: boolean,
  loadPlaylist: () => Promise<void>,
}

export default function useListPlaylist(userId: string, initialPlaylists: string[]): UseListPlaylist {
  const [playlists, setPlaylists] = useState<string[]>(initialPlaylists);
  const [loading, setLoading] = useState(false);

  const loadPlaylist = async () => {
    setLoading(true);
    const response = await Ajax.get<PlaylistListApiResponseData>(`/v1/user/${userId}/playlist/list`, {});
    setLoading(false);

    if (!response.data) {
      setPlaylists([]);
      return;
    }

    setPlaylists(response.data);
  };

  return { playlists, loading, loadPlaylist };
}
