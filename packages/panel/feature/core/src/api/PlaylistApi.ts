import { PlaylistItem, PlaylistListApiResponseData, SearchApiResponseData } from '@eve/types/api';
import Ajax from './Ajax';

export async function getAllPlaylists(userId: string, apiKey: string): Promise<PlaylistListApiResponseData|false> {
  const response = await Ajax.get<PlaylistListApiResponseData>(`/v1/user/${userId}/playlist/list`, {}, apiKey);

  if (response.error !== null) {
    return false;
  }

  return response.data;
}

export async function savePlaylist(userId: string, name: string, playlistItems: PlaylistItem[], apiKey: string): Promise<string|true> {
  const body = JSON.stringify({ name, playlistItems });
  const response = await Ajax.post(`/v1/user/${userId}/playlist/save`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}

export async function deletePlaylist(userId: string, name: string, apiKey: string): Promise<string|true> {
  const body = JSON.stringify({ name });
  const response = await Ajax.post(`/v1/user/${userId}/playlist/delete`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}

export async function getPlaylistItems(userId: string, name: string, apiKey: string): Promise<PlaylistItem[]|string> {
  const body = JSON.stringify({ name });
  const response = await Ajax.post<PlaylistItem[]>(`/v1/user/${userId}/playlist/view`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}

export async function musicSearch(query: string, userId: string, apiKey: string): Promise<SearchApiResponseData|string> {
  const body = JSON.stringify({ query });
  const response = await Ajax.post<SearchApiResponseData>(`/v1/user/${userId}/playlist/search/search`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}
