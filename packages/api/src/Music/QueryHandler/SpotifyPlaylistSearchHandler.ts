import AbstractQueryHandler from './AbstractQueryHandler';
import { PlaylistItem } from '../../Web/sharedApiTypes';
import getSpotifyApi from '../../Structures/getSpotifyApi';
import { MultiDownloader } from '../../Util/MultiDownloader';
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;
import ytsr from 'ytsr';

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

async function downloadOneByQuery(query: string, requesterId: string): Promise<PlaylistItem|false> {
  const result = await ytsr(query, { limit: 1 });
  const item = result.items[0];

  if (item?.type !== 'video') {
    return false;
  }

  return {
    url: item.url,
    title: item.title,
    uploader: item.author?.name || 'Unknown',
    ytId: item.id,
    requestedBy: requesterId,
  };
}
