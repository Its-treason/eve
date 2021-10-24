import { Container } from 'treason-di';
import SpotifyApi from 'spotify-web-api-node';
import SpotifyPlaylistSearchHandler from '../QueryHandler/SpotifyPlaylistSearchHandler';

export default async function spotifyPlaylistSearchHandlerFactory(container: Container): Promise<SpotifyPlaylistSearchHandler> {
  const spotifyApi = await container.get<SpotifyApi>('SpotifyApi');

  return new SpotifyPlaylistSearchHandler(spotifyApi);
}
