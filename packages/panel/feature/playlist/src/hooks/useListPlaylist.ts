import { getAllPlaylists } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

interface UseListPlaylist {
  playlists: string[],
  loading: boolean,
  loadPlaylist: () => Promise<void>,
}

export default function useListPlaylist(userId: string, initialPlaylists: string[]): UseListPlaylist {
  const [playlists, setPlaylists] = useState<string[]>(initialPlaylists);
  const [loading, setLoading] = useState(false);

  const loadPlaylist = async () => {
    const apiKey = String(getCookie('apiKey'));

    setLoading(true);
    const response = await getAllPlaylists(userId, apiKey);
    if (response === false) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    setPlaylists(response);
    setLoading(false);
  };

  return { playlists, loading, loadPlaylist };
}
