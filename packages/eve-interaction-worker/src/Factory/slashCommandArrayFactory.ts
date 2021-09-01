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

export default function slashCommandArrayFactory(): AbstractSlashCommand[] {
  const slashCommands = [];

  slashCommands.push(new BanCommand());
  slashCommands.push(new KickCommand());
  slashCommands.push(new WhoisCommand());
  slashCommands.push(new BonkCommand());
  slashCommands.push(new AvatarCommand());
  slashCommands.push(new InviteCommand());
  slashCommands.push(new PardonCommand());
  slashCommands.push(new PlayCommand());
  slashCommands.push(new LeaveCommand());
  slashCommands.push(new ClearCommand());
  slashCommands.push(new SkipCommand());
  slashCommands.push(new NowPlayingCommand());
  slashCommands.push(new QueueCommand());
  slashCommands.push(new PauseCommand());
  slashCommands.push(new ShuffleCommand());
  slashCommands.push(new LoopCommand());
  slashCommands.push(new MoveCommand());
  slashCommands.push(new DeleteCommand());
  return slashCommands;
}
