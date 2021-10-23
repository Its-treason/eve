import { Container } from 'treason-di';
import PlayCommand from '../PlayCommand';
import YtResultService from '../../../MusicPlayer/YtResultService';

export default async function playCommandFactory(container: Container): Promise<PlayCommand> {
  const ytService = await container.get<YtResultService>(YtResultService);

  return new PlayCommand(ytService);
}
