import { YtResult } from '../types';
import Url from 'url-parse';
import ytpl, { Item as plItem } from 'ytpl';
import ytsr, { Item } from 'ytsr';
import SpotifyApi from 'spotify-web-api-node';
import Logger from '../Util/Logger';

const ytRegex = /(.*\.|^)youtube.com/g;

export default class YtResultService {
  private logger: Logger;
  private spotifyApi: SpotifyApi;

  constructor(
    spotifyApi: SpotifyApi,
    logger: Logger,
  ) {
    this.logger = logger;
    this.spotifyApi = spotifyApi;
  }

  public async parseQuery(query: string, requesterId: string): Promise<YtResult[]> {
    let url;

    try {
      url = Url(query, true);
    } catch (e) {
      return [];
    }

    switch (true) {
      case ((url.pathname === '/watch' || url.pathname === '/playlist') && ytRegex.test(url.host) && url.query.list !== undefined):
        return await this.getAllUrlsFromPlaylist(url.query.list, requesterId);
      case (url.pathname === '/watch' && ytRegex.test(url.host) && url.query.v !== undefined):
        return [await this.searchForVideoById(url.query.v, requesterId)];
      case (url.host === 'open.spotify.com' && url.pathname.split('/')[1] === 'playlist' && url.pathname.split('/')[2] !== undefined):
        return await this.getVideosFromSpotifyPlaylist(url.pathname.split('/')[2], requesterId);
      default:
        return [await this.searchForVideoByQuery(query, requesterId)];
    }
  }

  private async getAllUrlsFromPlaylist(listId: string, requesterId: string): Promise<YtResult[]> {
    const result = await ytpl(listId);

    return result.items.map((item: plItem) => {
      return {
        url: item.shortUrl,
        title: item.title,
        uploader: item.author.name,
        ytId: item.id,
        requestedBy: requesterId,
      };
    });
  }

  private async searchForVideoByQuery(query: string, requesterId: string): Promise<YtResult> {
    const result = await ytsr(query, { limit: 1 });
    const item = result.items[0];

    if (item?.type !== 'video') {
      return;
    }

    return {
      url: item.url,
      title: item.title,
      uploader: item.author.name,
      ytId: item.id,
      requestedBy: requesterId,
    };
  }

  private async searchForVideoById(id: string, requesterId: string): Promise<YtResult> {
    const result = await ytsr(id, { limit: 10 });

    const item = result.items.filter((item: Item) => {
      if (item.type !== 'video') {
        return false;
      }

      return item.id === id;
    })[0];
    if (item.type !== 'video') {
      return;
    }

    return {
      url: item.url,
      title: item.title,
      uploader: item.author.name,
      ytId: item.id,
      requestedBy: requesterId,
    };
  }

  private async getVideosFromSpotifyPlaylist(playlistId: string, requesterId: string): Promise<YtResult[]> {
    const result = await this.spotifyApi.getPlaylistTracks(playlistId);

    if (result.body.total > 100) {
      this.logger.warning('Please Update code');
    }

    const ytResults: YtResult[] = [];

    for (const track of result.body.items) {
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

    return ytResults;
  }
}
