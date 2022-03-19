import QueryHandlerInterface from './QueryHandlerInterface';
import { QueryResult, YtResult } from '../../types';
import ytsr from 'ytsr';
import { injectable } from 'tsyringe';

@injectable()
export default class SearchQueryHandler implements QueryHandlerInterface {
  async handle(query: string, requesterId: string): Promise<QueryResult> {
    const result = await ytsr(query, { limit: 1 });
    const item = result.items[0];

    if (item?.type !== 'video') {
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

  getType(): string {
    return 'search';
  }
}
