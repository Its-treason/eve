import { PlaylistItem } from '../../web/sharedApiTypes';

export default abstract class AbstractQueryHandler {
  abstract handle(query: string, requesterId: string): Promise<PlaylistItem[]>;
}
