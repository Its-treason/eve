import { Ajax } from '@eve/panel/feature/core';
import { PlaylistItem } from '@eve/types/api';
import { useRouter } from 'next/navigation';
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
      setLoading(true);
      const body = JSON.stringify({ name: playlistName });
      const response = await Ajax.post<PlaylistItem[]>(`/v1/user/${userId}/playlist/view`, body);
      if (!response.data) {
        setFetchedPlaylistItems([]);
        router.push(`/user/${userId}/playlist?invalidName=true`);
        return;
      }
      setLoading(false);
      setFetchedPlaylistItems(response.data);
    })();

    return () => {
      abortController.abort();
    };
  }, [userId, playlistName]);

  return { fetchedPlaylistItems, loading };
}
