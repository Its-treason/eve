import { getPlaylistItems } from '@eve/panel/feature/core';
import { PlaylistItem } from '@eve/types/api';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface usePlaylistItemsData {
  fetchedPlaylistItems: PlaylistItem[],
  loading: boolean,
}

export default function usePlaylistItems(playlistName: string, userId: string): usePlaylistItemsData {
  const [fetchedPlaylistItems, setFetchedPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      const apiKey = String(getCookie('apiKey'));

      setLoading(true);
      const result = await getPlaylistItems(userId, playlistName, apiKey);
      if (typeof result === 'string') {
        setFetchedPlaylistItems([]);
        router.push(`/user/${userId}/playlist?invalidName=true`);
        return;
      }
      setLoading(false);
      setFetchedPlaylistItems(result);
    })();

    return () => {
      abortController.abort();
    };
  }, [userId, playlistName]);

  return { fetchedPlaylistItems, loading };
}
