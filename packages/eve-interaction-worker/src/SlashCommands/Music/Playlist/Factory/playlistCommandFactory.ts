import { Container } from 'treason-di';
import AbstractSubSlashCommand from '../../../AbstractSubSlashCommand';
import PlaylistCommand from '../PlaylistCommand';

export default async function playlistCommandFactory(container: Container): Promise<PlaylistCommand> {
  return new PlaylistCommand(
    await container.get<AbstractSubSlashCommand[]>('PlaylistCommands'),
  );
}
