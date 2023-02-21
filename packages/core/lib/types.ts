import { APIPartialEmoji, ButtonStyle } from 'discord-api-types/v9';

export type PlaylistItem = {
  ytId: string,
  url: string,
  title: string,
  uploader: string,
}

export interface DiscordAccessToken {
  accessToken: string|null,
  tokenType: string|null,
}

export interface QueryResult {
  firstResult: PlaylistItem,
  getAll: () => Promise<PlaylistItem[]>
}

export interface ChannelActivityRow {
  userId: string,
  channelId: string,
  guildId: string,
  joinedAt: Date,
  leftAt: Date,
}

export interface DiscordApiGuildsResponse {
  id: string,
  name: string,
  icon: string,
  owner: boolean,
  permission: string,
  features: string[],
}

export interface RoleMenuEntry {
  role: string,
  label: string,
  color: ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger
  emoji?: APIPartialEmoji,
}

export interface RoleMenu {
  id: string,
  serverId: string,
  channelId: string,
  messageId: string,
  entries: RoleMenuEntry[],
  message: string,
  embed: ReducedEmbed|null,
  name: string,
}

export enum PublicLogCategories {
  CommandUsed = 'CommandUsed',
  NativeModerationAction = 'NativeModerationAction',
  ModerationCommandUsed = 'ModerationCommandUsed',
  AutoActionExecuted = 'AutoActionExecuted',
  SettingChanged = 'SettingChanged',
  ErrorOccurred = 'ErrorOccurred',
}

export type PublicLogRecord = {
  timestamp: string,
  message: string,
  categorie: PublicLogCategories,
  relatedServer: string[],
  relatedUser: string[],
}

export type ReducedEmbed = {
  title: string,
  description: string,
  color: string,
  footer: string,
  fields: ReducedEmbedField[],
}

export type ReducedEmbedField = {
  name: string,
  value: string,
  inline: boolean,
}
