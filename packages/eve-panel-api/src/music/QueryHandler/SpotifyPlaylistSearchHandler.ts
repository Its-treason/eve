import AbstractQueryHandler from './AbstractQueryHandler';
import { PlaylistItem } from '../../web/sharedApiTypes';
import getSpotifyApi from '../../structures/getSpotifyApi';
import { MultiDownloader } from '../MultiDownloader';
import downloadOneByQuery from '../util/downloadOneByQuery';
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;

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
        if (track.track === null) {
          continue;
        }

        const artists = track.track.artists.map((x) => x.name).join(' ');
        const query = `${track.track.name} ${artists}`;

        ytResults.push(...(await multiDownload.download(downloadOneByQuery(query, requesterId))));
      }

      i++;
    } while (tracks.length > 0);

    ytResults.push(...(await multiDownload.flush()));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ytResults.filter<PlaylistItem>((item) => item !== false);
  }
}
