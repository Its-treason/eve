import QueryHandlerInterface from './QueryHandlerInterface';
import { QueryResult, YtResult } from '../../types';
import ytpl, { Item as plItem } from 'ytpl';
import { injectable } from 'tsyringe';

@injectable()
export default class YtPlaylistSearchHandler implements QueryHandlerInterface {
  async handle(query: string, requesterId: string): Promise<QueryResult> {
    const result = await ytpl(query, { limit: 1 });

    const firstResult = {
      url: result.items[0].url,
      title: result.items[0].title,
      uploader: result.items[0].author.name,
      ytId: result.items[0].id,
      requestedBy: requesterId,
    };

    return {
      firstResult,
      getAll: async (): Promise<YtResult[]> => {
        const result = await ytpl(query);

        const ytResult = result.items.map((item: plItem) => {
          return {
            url: item.shortUrl,
            title: item.title,
            uploader: item.author.name,
            ytId: item.id,
            requestedBy: requesterId,
          };
        });
        ytResult.shift();
        return ytResult;
      },
    };
  }

  getType(): string {
    return 'yt-playlist';
  }
}
