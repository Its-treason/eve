import { PlaylistItem } from './api/sharedApiTypes';

export interface BreadCrumpItem {
  label: string,
  to?: string,
}

export interface CheckablePlaylistItem {
  checked: boolean,
  item: PlaylistItem,
}
