import AbstractQueryHandler from './AbstractQueryHandler';
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;
import SpotifyApi from 'spotify-web-api-node';
import { PlaylistItem } from '../../web/sharedApiTypes';
import getSpotifyApi from '../../structures/getSpotifyApi';
import { MultiDownloader } from '../MultiDownloader';
import downloadOneByQuery from '../util/downloadOneByQuery';

export default class SpotifyPlaylistSearchHandler implements AbstractQueryHandler {
  async handle(query: string, requesterId: string): Promise<PlaylistItem[]> {
    const multiDownload = new MultiDownloader<PlaylistItem|false>();
    const spotifyApi = await getSpotifyApi();
    let i = 0;
    const ytResults: (PlaylistItem|false)[] = [];

    let tracks: PlaylistTrackObject[];
    do {
      const result = await spotifyApi.getPlaylistTracks(query, { limit: 100, offset: i * 100 });
      tracks = result.body.items;

      for (const track of tracks) {
        const artists = track.track.artists.map((x) => x.name).join(' ');
        const query = `${track.track.name} ${artists}`;

        ytResults.push(...(await multiDownload.download(downloadOneByQuery(query, requesterId))));
      }

      i++;
    } while (tracks.length > 0);

    ytResults.push(...(await multiDownload.flush()));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore ts ist so ein dummer hurensohn
    return ytResults.filter<PlaylistItem>((item) => item !== false);
  }
}
