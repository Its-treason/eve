import YtResultService from '../YtResultService';
import { Container } from 'treason-di';
import Logger from '../../Util/Logger';
import SpotifyApi from 'spotify-web-api-node';

export default async function YtResultServiceFactory(container: Container): Promise<YtResultService> {
  const spotifyApi = await container.get<SpotifyApi>('SpotifyApi'); 
  const logger = await container.get<Logger>(Logger);
  
  return new YtResultService(spotifyApi, logger);
}
