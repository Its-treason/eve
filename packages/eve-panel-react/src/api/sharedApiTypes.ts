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
  type: 'text'|'voice',
  name: string,
  id: string,

}

// YTResult === PlaylistItem
export interface PlaylistItem {
  url: string,
  uploader: string,
  title: string,
  ytId: string,
  requestedBy: string,
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
  leftAt: string|null,
  length: string|null,
}


export interface RoleMenuEntry {
  role: string,
  label: string,
  emoji: string,
}

export interface RoleMenu {
  id: string,
  serverId: string,
  channelId: string,
  messageId: string,
  entries: RoleMenuEntry[],
  message: string,
  name: string,
}

// ApiResponses:
export interface LoginApiResponseData {
  apiKey: string,
  user: ReducedUser,
}

export type VerifyApiResponseData = ReducedUser

export interface LogoutApiResponseData {
  loggedOut: true,
}

export type RoleListApiResponseData = ReducedRole[];

export type BasicServerInfoApiResponseData = ReducedServer;

export type BasicUserInfoApiResponseData = ReducedUser;

export interface InviteApiResponseData {
  invite: string,
}

export type PlaylistListApiResponseData = string[];

export interface PlaylistSaveApiRequestData {
  name: string,
  playlistItems: PlaylistItem[],
}

export interface PlaylistSaveApiResponseData {
  saved: true,
}

export interface PlaylistDeleteApiRequestData {
  name: string,
  playlistItems: PlaylistItem[],
}
export interface PlaylistDeleteApiResponseData {
  deleted: true,
}

export interface PlaylistViewApiRequestData {
  name: string,
}
export type PlaylistViewApiResponseData = PlaylistItem[];

export interface SpotifyPreviewApiRequestData {
  query: string,
}
export interface SpotifyPreviewApiResponseData {
  name: string,
  description: string,
  owner: string,
  count: number
}

export interface SearchApiRequestData {
  query: string,
}
export interface SearchApiResponseData {
  playlistItems: PlaylistItem[],
  allChecked: boolean,
}

export interface SpotifyImportApiRequestData {
  query: string,
  name: string,
}
export interface SpotifyImportApiResponseData {
  acknowledge: true
}

export interface UserActivityApiRequestData {
  startDate: string, // Should be date parsable
  endDate: string,
}
export type UserActivityApiResponseData = ActivityRow[];

export interface SaveAutoActionsRequestData {
  type: string,
  payload: string,
}
export type SaveAutoActionsResponseData = boolean;

export interface GetAutoActionsRequestData {
  type: string,
}
export type GetAutoActionsResponseData = string;
