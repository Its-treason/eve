import { Container } from 'treason-di';
import PlayCommand from '../PlayCommand';
import YtResultService from '../../../MusicPlayer/YtResultService';
import Logger from '../../../Util/Logger';

export default async function playCommandFactory(container: Container): Promise<PlayCommand> {
  const ytService = await container.get<YtResultService>(YtResultService);
  const logger = await container.get<Logger>(Logger);

  return new PlayCommand(ytService, logger);
}
