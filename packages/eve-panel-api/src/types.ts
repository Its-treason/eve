import { PlaylistItem } from './web/sharedApiTypes';

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
