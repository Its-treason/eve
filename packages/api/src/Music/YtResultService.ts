import PlayQuery from '../Value/PlayQuery';
import { PlaylistItem } from '../Web/sharedApiTypes';
import { singleton } from 'tsyringe';
import AbstractQueryHandler from './QueryHandler/AbstractQueryHandler';
import SearchQueryHandler from './QueryHandler/SearchQueryHandler';
import SpotifyPlaylistSearchHandler from './QueryHandler/SpotifyPlaylistSearchHandler';
import SearchYtIdHandler from './QueryHandler/SearchYtIdHandler';
import YtPlaylistSearchHandler from './QueryHandler/YtPlaylistSearchHandler';

@singleton()
export default class YtResultService {
  private handlers = new Map<string, AbstractQueryHandler>();

  constructor() {
    this.handlers.set('yt-playlist', new YtPlaylistSearchHandler());
    this.handlers.set('search-id', new SearchYtIdHandler());
    this.handlers.set('spotify-playlist', new SpotifyPlaylistSearchHandler());
    this.handlers.set('search', new SearchQueryHandler());
  }

  public async parseQuery(playQuery: PlayQuery, requesterId: string): Promise<PlaylistItem[]> {
    const handler = this.handlers.get(playQuery.getType());
    if (!handler) {
      throw new Error('Undefined SearchHandler!');
    }
    return await handler.handle(playQuery.getQuery(), requesterId);
  }
}
