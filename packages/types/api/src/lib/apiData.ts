import { ActivityRow, PlaylistItem, ReducedRole, ReducedServer, ReducedUser } from './general';

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
