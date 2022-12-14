import { Channel, CommandInteraction, Guild, GuildMember, Interaction, Message, Role, User } from 'discord.js';
import * as yasha from 'yasha';
import { APIApplicationCommandOption } from 'discord-api-types/v9';

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
  execute: (message: Message, args: ParsedArg[]) => Promise<void>;
}

export interface EveSlashCommand {
  data: {name: string, description: string, options: APIApplicationCommandOption[]},
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

export type Validator = (guild: Guild) => Promise<{valid: boolean, msg?: string}>

export type ValidatorWrapper = (...args: any[]) => Validator;

export type ParsedArg = (string|User|GuildMember|Channel|Role);



export interface MusicResult {
  url: string,
  uploader: string,
  title: string,
  ytId: string,
  requestedBy: string,
  track: yasha.Track.Track,
}
