import BanCommand from '../SlashCommands/BanCommand';
import KickCommand from '../SlashCommands/KickCommand';
import PardonCommand from '../SlashCommands/PardonCommand';
import WhoisCommand from '../SlashCommands/WhoisCommand';
import BonkCommand from '../SlashCommands/BonkCommand';
import AvatarCommand from '../SlashCommands/AvatarCommand';
import InviteCommand from '../SlashCommands/InviteCommand';
import AbstractSlashCommand from '../SlashCommands/AbstractSlashCommand';
import PlayCommand from '../SlashCommands/Music/PlayCommand';
import SkipCommand from '../SlashCommands/Music/SkipCommand';
import ClearCommand from '../SlashCommands/Music/ClearCommand';
import LeaveCommand from '../SlashCommands/Music/LeaveCommand';
import NowPlayingCommand from '../SlashCommands/Music/NowPlayingCommand';
import QueueCommand from '../SlashCommands/Music/QueueCommand';
import PauseCommand from '../SlashCommands/Music/PauseCommand';
import ShuffleCommand from '../SlashCommands/Music/ShuffleCommand';
import LoopCommand from '../SlashCommands/Music/LoopCommand';
import MoveCommand from '../SlashCommands/Music/MoveCommand';
import DeleteCommand from '../SlashCommands/Music/DeleteCommand';
import PlaylistCommand from '../SlashCommands/Music/Playlist/PlaylistCommand';
import GotoCommand from '../SlashCommands/Music/GotoCommand';
import { Container } from 'treason-di';

export default async function slashCommandArrayFactory(container: Container): Promise<AbstractSlashCommand[]> {
  const slashCommands: AbstractSlashCommand[] = [];

  slashCommands.push(await container.get<BanCommand>(BanCommand));
  slashCommands.push(await container.get<KickCommand>(KickCommand));
  slashCommands.push(await container.get<WhoisCommand>(WhoisCommand));
  slashCommands.push(await container.get<BonkCommand>(BonkCommand));
  slashCommands.push(await container.get<AvatarCommand>(AvatarCommand));
  slashCommands.push(await container.get<InviteCommand>(InviteCommand));
  slashCommands.push(await container.get<PardonCommand>(PardonCommand));
  slashCommands.push(await container.get<PlayCommand>(PlayCommand));
  slashCommands.push(await container.get<LeaveCommand>(LeaveCommand));
  slashCommands.push(await container.get<ClearCommand>(ClearCommand));
  slashCommands.push(await container.get<SkipCommand>(SkipCommand));
  slashCommands.push(await container.get<NowPlayingCommand>(NowPlayingCommand));
  slashCommands.push(await container.get<QueueCommand>(QueueCommand));
  slashCommands.push(await container.get<PauseCommand>(PauseCommand));
  slashCommands.push(await container.get<ShuffleCommand>(ShuffleCommand));
  slashCommands.push(await container.get<LoopCommand>(LoopCommand));
  slashCommands.push(await container.get<MoveCommand>(MoveCommand));
  slashCommands.push(await container.get<DeleteCommand>(DeleteCommand));
  slashCommands.push(await container.get<PlaylistCommand>(PlaylistCommand));
  slashCommands.push(await container.get<GotoCommand>(GotoCommand));

  return slashCommands;
}
