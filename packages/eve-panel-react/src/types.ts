import { PlaylistItem } from './api/sharedApiTypes';

export interface BreadCrumpItem {
  label: string,
  to?: string,
  active: boolean,
}

export interface CheckablePlaylistItem {
  checked: boolean,
  item: PlaylistItem,
}
