import {Channel, Client, Collection, CommandInteraction, GuildMember, Interaction, Message, PermissionString, Role, User} from 'discord.js';
import {APIApplicationCommandOption} from 'discord-api-types/v9';

export interface EveClient extends Client {
  commands?: Collection<string, EveCommand>;
}

export interface EveInteraction {
  name: string,
  execute: (args: string[], interaction: Interaction) => Promise<void>
}

export interface EveEvent {
  name: string,
  execute: (...payload: never) => Promise<void>
}

export interface EveCommand {
  name: string;
  alias: string[];
  permissions: PermissionString[];
  allowDms: boolean;
  execute: (message: Message, args: ParsedArg[]) => Promise<void>;
}

export interface EveSlashCommand {
  data: {name: string, description: string, options: APIApplicationCommandOption[]},
  permissions: PermissionString[];
  allowDms: boolean;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export type EventTopic = 'ban-interaction.create'
  | 'ban-interaction.executed'
  | 'ban-interaction.timedOut'
  | 'kick-interaction.create'
  | 'kick-interaction.executed'
  | 'kick-interaction.timedOut'
  | 'pardon-interaction.create'
  | 'pardon-interaction.executed'
  | 'pardon-interaction.timedOut'


export type ParsedArg = (string|User|GuildMember|Channel|Role);
