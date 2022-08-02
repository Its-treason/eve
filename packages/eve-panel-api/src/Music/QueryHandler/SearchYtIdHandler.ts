import AbstractQueryHandler from './AbstractQueryHandler';
import ytsr, { Item } from 'ytsr';
import { PlaylistItem } from '../../Web/sharedApiTypes';

export default class SearchYtIdHandler implements AbstractQueryHandler {
  async handle(query: string, requesterId: string): Promise<PlaylistItem[]> {
    const result = await ytsr(`"${query}"`, { limit: 10 });

    // YT will sometimes return some other video instead of the video with the id we searched
    const item = result.items.filter((item: Item) => {
      // check type to make ts happy
      if (item.type !== 'video') {
        return false;
      }

      return item.id === query;
    })[0];
    // check type to make ts happy
    if (item.type !== 'video') {
      throw new Error('Invalid YT-Search-Result type');
    }

    const firstResult: PlaylistItem = {
      url: item.url,
      title: item.title,
      uploader: item.author?.name || 'Unknown',
      ytId: item.id,
      requestedBy: requesterId,
    };

    return [firstResult];
  }
}
