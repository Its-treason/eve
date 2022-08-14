import Ajax from './Ajax';
import { PlaylistItem, PlaylistListApiResponseData, SearchApiResponseData } from './sharedApiTypes';

export default class PlaylistApi {
  public static async getAllPlaylists(userId: string): Promise<PlaylistListApiResponseData|false> {
    const response = await Ajax.get(`/v1/user/${userId}/playlist/list`);

    if (response.code !== 200) {
      return false;
    }

    return response.data.data;
  }

  public static async savePlaylist(userId: string, name: string, playlistItems: PlaylistItem[]): Promise<string|true> {
    const body = JSON.stringify({ name, playlistItems });
    const response = await Ajax.post(`/v1/user/${userId}/playlist/save`, body);

    if (response.code !== 200) {
      return response.data.error;
    }

    return true;
  }

  public static async deletePlaylist(userId: string, name: string): Promise<string|true> {
    const body = JSON.stringify({ name });
    const response = await Ajax.post(`/v1/user/${userId}/playlist/delete`, body);

    if (response.code !== 200) {
      return response.data.error;
    }

    return true;
  }

  public static async getPlaylistItems(userId: string, name: string): Promise<PlaylistItem[]|string> {
    const body = JSON.stringify({ name });
    const response = await Ajax.post(`/v1/user/${userId}/playlist/view`, body);

    if (response.code !== 200) {
      return response.data.error;
    }

    return response.data.data;
  }

  public static async search(query: string, userId: string): Promise<SearchApiResponseData|string> {
    const body = JSON.stringify({ query });
    const response = await Ajax.post(`/v1/user/${userId}/playlist/search/search`, body);

    if (response.code !== 200) {
      return response.data.error;
    }

    return response.data.data;
  }
}
