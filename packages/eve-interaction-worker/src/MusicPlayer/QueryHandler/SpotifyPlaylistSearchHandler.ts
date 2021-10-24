import AbstractQueryHandler from './AbstractQueryHandler';
import { QueryResult, YtResult } from '../../types';
import ytsr from 'ytsr';
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;
import SpotifyApi from 'spotify-web-api-node';

export default class SpotifyPlaylistSearchHandler implements AbstractQueryHandler {
  private spotifyApi: SpotifyApi;

  constructor(
    spotifyApi: SpotifyApi,
  ) {
    this.spotifyApi = spotifyApi;
  }

  async handle(query: string, requesterId: string): Promise<QueryResult> {
    const result = await this.spotifyApi.getPlaylistTracks(query, { limit: 1, offset: 0 });

    const track = result.body.items[0];

    const artists = track.track.artists.map((x) => x.name).join(' ');
    const searchQuery = `${track.track.name} ${artists}`;
    const ytResult = await ytsr(searchQuery, { limit: 1 });
    const item = ytResult.items[0];

    if (item?.type !== 'video') {
      return;
    }

    const firstResult = {
      url: item.url,
      title: item.title,
      uploader: item.author.name,
      ytId: item.id,
      requestedBy: requesterId,
    };

    return {
      firstResult,
      getAll: async (): Promise<YtResult[]> => {
        let i = 0;
        const ytResults: YtResult[] = [];

        let tracks: PlaylistTrackObject[];
        do {
          const result = await this.spotifyApi.getPlaylistTracks(query, { limit: 100, offset: i * 100 });
          tracks = result.body.items;

          for (const track of tracks) {
            const artists = track.track.artists.map((x) => x.name).join(' ');
            const query = `${track.track.name} ${artists}`;
            const result = await ytsr(query, { limit: 1 });
            const item = result.items[0];

            if (item?.type !== 'video') {
              return;
            }

            ytResults.push({
              url: item.url,
              title: item.title,
              uploader: item.author.name,
              ytId: item.id,
              requestedBy: requesterId,
            });
          }

          i++;
        } while (tracks.length > 0);

        ytResults.shift();

        return ytResults;
      },
    };
  }
}
