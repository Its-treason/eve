import { Container } from 'treason-di';
import PlaylistProjection from '../../../../Projection/PlaylistProjection';
import PlaylistDeleteCommand from '../PlaylistDeleteCommand';

export default async function playlistDeleteCommandFactory(container: Container): Promise<PlaylistDeleteCommand> {
  return new PlaylistDeleteCommand(
    await container.get<PlaylistProjection>(PlaylistProjection),
  );
}
