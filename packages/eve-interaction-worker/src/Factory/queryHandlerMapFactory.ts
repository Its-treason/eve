import AbstractQueryHandler from '../MusicPlayer/QueryHandler/AbstractQueryHandler';
import {Container} from 'treason-di';
import SearchQueryHandler from '../MusicPlayer/QueryHandler/SearchQueryHandler';
import SearchYtIdHandler from '../MusicPlayer/QueryHandler/SearchYtIdHandler';
import YtPlaylistSearchHandler from '../MusicPlayer/QueryHandler/YtPlaylistSearchHandler';
import SpotifyPlaylistSearchHandler from '../MusicPlayer/QueryHandler/SpotifyPlaylistSearchHandler';

export default async function QueryHandlerMapFactory(container: Container): Promise<Map<string, AbstractQueryHandler>> {
  const map = new Map<string, AbstractQueryHandler>();

  map.set('search', await container.get<SearchQueryHandler>(SearchQueryHandler));
  map.set('search-id', await container.get<SearchYtIdHandler>(SearchYtIdHandler));
  map.set('yt-playlist', await container.get<YtPlaylistSearchHandler>(YtPlaylistSearchHandler));
  map.set('spotify-playlist', await container.get<SpotifyPlaylistSearchHandler>(SpotifyPlaylistSearchHandler));

  return map;
}
