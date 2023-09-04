import { injectable } from 'tsyringe';
import { MusicResult } from '../types';
import * as yasha from 'yasha';
import { MultiDownloader } from '../Util/MultiDownloader';
import { Logger } from '@eve/core';

@injectable()
export default class MusicResultService {
  constructor(
    private logger: Logger,
  ) {}

  public async parseQuery(query: string, requesterId: string): Promise<MusicResult[]|false> {
    const resultTracks = await this.findResult(query);
    if (resultTracks === null) {
      return false;
    }

    const youtubeTracks = await this.convertToYoutubeTracks(resultTracks);
    return youtubeTracks.map(ytTrack => this.wrapYoutubeTrack(ytTrack, requesterId));
  }

  private async convertToYoutubeTracks(tracks: yasha.Track[]): Promise<yasha.Track[]> {
    const result: (yasha.Track|false)[] = [];

    const multiDownloader = new MultiDownloader<yasha.Track|false>(25);

    for (const track of tracks) {
      const trackPromise = this.trackToYoutubeTrack(track);

      result.push(...(await multiDownloader.download(trackPromise)));
    }
    result.push(...(await multiDownloader.flush()));

    return result.filter((item): item is yasha.Track => item !== false);
  }

  private async trackToYoutubeTrack(track: yasha.Track): Promise<yasha.Track|false> {
    if (track instanceof yasha.api.Youtube.Track) {
      return track;
    }

    const searchResults = await yasha.api.Youtube.search(`${track.author} - ${track.title}`);

    if (!searchResults) {
      return false;
    }

    for (const result of searchResults) {
      return result;
    }

    return false;
  }

  private async findResult(query: string): Promise<yasha.Track[]|null> {
    let resolveResult: yasha.Track|yasha.TrackPlaylist|null = null;
    try {
      resolveResult = await yasha.Source.resolve(query);
    } catch (error) {
      this.logger.notice('Error while resolving a query', { error, query });
    }

    let searchResult: yasha.TrackResults|null = null;
    if (resolveResult === null) {
      searchResult = await yasha.Source.Youtube.search(query);
      if (!searchResult || searchResult.length === 0) {
        return null;
      }

      return [searchResult[0]];
    }

    if (resolveResult instanceof yasha.Track) {
      return [resolveResult];
    }

    // Resolve will only return the first 100 items of an playlist
    if (resolveResult instanceof yasha.api.Spotify.Playlist && resolveResult.length >= 100) {
      // @ts-expect-error
      return yasha.api.Spotify.playlist(resolveResult.id);
    }

    return resolveResult;
  }

  // @ts-expect-error
  private wrapYoutubeTrack(track: yasha.api.Youtube.Track, requesterId: string): MusicResult {
    return {
      title: track.title,
      ytId: track.id,
      requestedBy: requesterId,
      track,
      url: track.url,
      uploader: track.author,
    };
  }
}
