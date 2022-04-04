import AbstractQueryHandler from '../music/QueryHandler/AbstractQueryHandler';
import YtPlaylistSearchHandler from '../music/QueryHandler/YtPlaylistSearchHandler';
import SearchYtIdHandler from '../music/QueryHandler/SearchYtIdHandler';
import SpotifyPlaylistSearchHandler from '../music/QueryHandler/SpotifyPlaylistSearchHandler';
import SearchQueryHandler from '../music/QueryHandler/SearchQueryHandler';

export default function (): Map<string, AbstractQueryHandler> {
  const map = new Map<string, AbstractQueryHandler>();

  map.set('yt-playlist', new YtPlaylistSearchHandler());
  map.set('search-id', new SearchYtIdHandler());
  map.set('spotify-playlist', new SpotifyPlaylistSearchHandler());
  map.set('search', new SearchQueryHandler());

  return map;
}
