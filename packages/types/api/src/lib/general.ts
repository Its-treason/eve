import { PublicLogCategories } from '@eve/core';

export interface ReducedServer {
  name: string,
  id: string,
  icon: string,
}

export interface ReducedUser {
  name: string,
  id: string,
  icon: string,
  admin: boolean,
  server: ReducedServer[],
}

export interface ReducedRole {
  name: string,
  id: string,
  color: string,
  isAdmin: boolean,
  isModerator: boolean,
}

export interface ReducedChannel {
  type: 'text' | 'voice',
  name: string,
  id: string,
}

// ReducedEmoji === PartialEmoji
export type ReducedEmoji = {
  id: string | null;
  name: string | null;
  animated?: boolean;
}

// YTResult === PlaylistItem
export interface PlaylistItem {
  url: string,
  uploader: string,
  title: string,
  ytId: string,
  requestedBy?: string,
}

export interface ActivityRow {
  channelName: string,
  channelId: string,
  userId: string,
  userName: string,
  userIcon: string,
  guildName: string,
  guildId: string,
  guildIcon: string,
  joinedAt: string,
  leftAt: string | null,
  length: string | null,
}

export interface RoleMenuEntry {
  role: string,
  label: string,
  color: number,
  emoji?: ReducedEmoji,
}

export interface RoleMenu {
  id: string,
  serverId: string,
  channelId: string,
  messageId: string,
  entries: RoleMenuEntry[],
  message: string,
  embed: ReducedEmbed | null,
  name: string,
}

export interface BreadCrumpItem {
  label: string,
  to?: string,
}

export interface CheckablePlaylistItem {
  checked: boolean,
  item: PlaylistItem,
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

export type FormattedPublicLogRecord = {
  timestamp: string,
  message: string,
  categorie: PublicLogCategories,
  relatedServer: ReducedServer[],
  relatedUser: ReducedUser[],
}
