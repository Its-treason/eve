import { Container } from 'treason-di';
import PlaylistProjection from '../../../../Projection/PlaylistProjection';
import PlaylistSaveCommand from '../PlaylistSaveCommand';

export default async function playlistSaveCommandFactory(container: Container): Promise<PlaylistSaveCommand> {
  return new PlaylistSaveCommand(
    await container.get<PlaylistProjection>(PlaylistProjection),
  );
}
