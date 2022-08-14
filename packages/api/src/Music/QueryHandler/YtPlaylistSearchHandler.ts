import AbstractQueryHandler from './AbstractQueryHandler';
import * as ytpl from 'ytpl';
import { PlaylistItem } from '../../Web/sharedApiTypes';

export default class YtPlaylistSearchHandler implements AbstractQueryHandler {
  async handle(query: string, requesterId: string): Promise<PlaylistItem[]> {
    let result;
    try {
      result = await ytpl(query);
    } catch {
      return [];
    }

    return result.items.map((item: ytpl.Item) => {
      return {
        url: item.shortUrl,
        title: item.title,
        uploader: item.author.name,
        ytId: item.id,
        requestedBy: requesterId,
      };
    });
  }
}
