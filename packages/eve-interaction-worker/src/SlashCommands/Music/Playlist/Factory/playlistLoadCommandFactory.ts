import { Container } from 'treason-di';
import PlaylistProjection from '../../../../Projection/PlaylistProjection';
import PlaylistLoadCommand from '../PlaylistLoadCommand';

export default async function playlistLoadCommandFactory(container: Container): Promise<PlaylistLoadCommand> {
  return new PlaylistLoadCommand(
    await container.get<PlaylistProjection>(PlaylistProjection),
  );
}
