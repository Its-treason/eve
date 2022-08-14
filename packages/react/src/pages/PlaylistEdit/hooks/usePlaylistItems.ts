import { PlaylistItem } from '../../../api/sharedApiTypes';
import PlaylistApi from '../../../api/PlaylistApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface usePlaylistItemsData {
  fetchedPlaylistItems: PlaylistItem[],
  loading: boolean,
  loadPlaylistItems: () => Promise<void>,
}

export default function usePlaylistItems(playlistName: string, userId: string): usePlaylistItemsData {
  const [fetchedPlaylistItems, setFetchedPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadPlaylistItems = async () => {
    if (userId === '' || playlistName === '') {
      return;
    }

    setLoading(true);

    const result = await PlaylistApi.getPlaylistItems(userId, playlistName);
    if (typeof result === 'string') {
      navigate(`/user/${userId}/playlist?invalidName=true`);
      throw new Error(result);
    }
    setFetchedPlaylistItems(result);
    setLoading(false);
  };

  useEffect(() => {
    loadPlaylistItems();
  }, [userId, playlistName]);

  return { fetchedPlaylistItems, loading, loadPlaylistItems };
}
