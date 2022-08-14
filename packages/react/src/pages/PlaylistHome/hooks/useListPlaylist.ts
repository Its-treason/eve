import { useEffect, useState } from 'react';
import PlaylistApi from '../../../api/PlaylistApi';

interface UseListPlaylist {
  playlists: string[],
  loading: boolean,
  loadPlaylist: () => Promise<void>,
}

export default function useListPlaylist(userId: string): UseListPlaylist {
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPlaylist = async () => {
    if (userId === '') {
      return;
    }

    setLoading(true);
    const response = await PlaylistApi.getAllPlaylists(userId);
    if (response === false) {
      return;
    }

    setPlaylists(response);
    setLoading(false);
  };

  useEffect(() => {
    loadPlaylist();
  }, [userId]);

  return { playlists, loading, loadPlaylist };
}
