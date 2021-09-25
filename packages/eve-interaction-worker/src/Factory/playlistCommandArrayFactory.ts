import { Container } from 'treason-di';
import AbstractSubSlashCommand from '../SlashCommands/AbstractSubSlashCommand';
import PlaylistDeleteCommand from '../SlashCommands/Music/Playlist/PlaylistDeleteCommand';
import PlaylistListCommand from '../SlashCommands/Music/Playlist/PlaylistListCommand';
import PlaylistLoadCommand from '../SlashCommands/Music/Playlist/PlaylistLoadCommand';
import PlaylistSaveCommand from '../SlashCommands/Music/Playlist/PlaylistSaveCommand';

export default async function playlistCommandArrayFactory(container: Container): Promise<AbstractSubSlashCommand[]> {
  const playlistCommands: AbstractSubSlashCommand[] = [];

  playlistCommands.push(await container.get<PlaylistDeleteCommand>(PlaylistDeleteCommand));
  playlistCommands.push(await container.get<PlaylistListCommand>(PlaylistListCommand));
  playlistCommands.push(await container.get<PlaylistLoadCommand>(PlaylistLoadCommand));
  playlistCommands.push(await container.get<PlaylistSaveCommand>(PlaylistSaveCommand));

  return playlistCommands;
}
