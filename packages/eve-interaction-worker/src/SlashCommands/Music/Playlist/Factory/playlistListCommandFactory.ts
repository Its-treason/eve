import { Container } from 'treason-di';
import PlaylistProjection from '../../../../Projection/PlaylistProjection';
import PlaylistListCommand from '../PlaylistListCommand';

export default async function playlistListCommandFactory(container: Container): Promise<PlaylistListCommand> {
  return new PlaylistListCommand(
    await container.get<PlaylistProjection>(PlaylistProjection),
  );
}
