import BanCommand from '../SlashCommands/BanCommand';
import KickCommand from '../SlashCommands/KickCommand';
import PardonCommand from '../SlashCommands/PardonCommand';
import WhoisCommand from '../SlashCommands/WhoisCommand';
import BonkCommand from '../SlashCommands/BonkCommand';
import AvatarCommand from '../SlashCommands/AvatarCommand';
import InviteCommand from '../SlashCommands/InviteCommand';
import AbstractSlashCommand from '../SlashCommands/AbstractSlashCommand';

export default function slashCommandArrayFactory(): AbstractSlashCommand[] {
  const slashCommands = [];

  slashCommands.push(new BanCommand());
  slashCommands.push(new KickCommand());
  slashCommands.push(new WhoisCommand());
  slashCommands.push(new BonkCommand());
  slashCommands.push(new AvatarCommand());
  slashCommands.push(new InviteCommand());
  slashCommands.push(new PardonCommand());
  return slashCommands;
}
