import AbstractQueryHandler from './AbstractQueryHandler';
import ytpl, { Item as plItem } from 'ytpl';
import { PlaylistItem } from '../../web/sharedApiTypes';

export default class YtPlaylistSearchHandler implements AbstractQueryHandler {
  async handle(query: string, requesterId: string): Promise<PlaylistItem[]> {
    const result = await ytpl(query);

    return result.items.map((item: plItem) => {
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
