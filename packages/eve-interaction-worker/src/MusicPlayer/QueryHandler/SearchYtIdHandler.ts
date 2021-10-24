import AbstractQueryHandler from './AbstractQueryHandler';
import { QueryResult, YtResult } from '../../types';
import ytsr, { Item } from 'ytsr';

export default class SearchYtIdHandler implements AbstractQueryHandler {
  async handle(query: string, requesterId: string): Promise<QueryResult> {
    const result = await ytsr(query, { limit: 10 });

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
      return;
    }

    const firstResult = {
      url: item.url,
      title: item.title,
      uploader: item.author.name,
      ytId: item.id,
      requestedBy: requesterId,
    };

    return {
      firstResult,
      getAll: async (): Promise<YtResult[]> => [], // No other results will be returned here
    };
  }
}
