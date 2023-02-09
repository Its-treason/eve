import AbstractQueryHandler from './AbstractQueryHandler';
import ytsr from 'ytsr';
import { PlaylistItem } from '../../Web/sharedApiTypes';
import { Item as plItem } from 'ytsr';

export default class SearchQueryHandler implements AbstractQueryHandler {
  async handle(query: string, requesterId: string): Promise<PlaylistItem[]> {
    const result = await ytsr(query, { limit: 10 });

    const items = result.items.reduce((acc: PlaylistItem[], item: plItem): PlaylistItem[] => {
      if (item.type !== 'video') {
        return acc;
      }

      acc.push({
        url: item.url,
        title: item.title,
        uploader: item.author?.name || 'Unknown',
        ytId: item.id,
        requestedBy: requesterId,
      });
      return acc;
    }, []);
    return items.splice(0, 5);
  }
}
