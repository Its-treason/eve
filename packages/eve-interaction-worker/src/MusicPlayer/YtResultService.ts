import { QueryResult } from '../types';
import AbstractQueryHandler from './QueryHandler/AbstractQueryHandler';
import PlayQuery from '../Value/PlayQuery';

export default class YtResultService {
  private handler: Map<string, AbstractQueryHandler>;

  constructor(
    handler: Map<string, AbstractQueryHandler>,
  ) {
    this.handler = handler;
  }

  public async parseQuery(query: string, requesterId: string): Promise<QueryResult> {
    const playQuery = PlayQuery.fromQuery(query);

    const handler = this.handler.get(playQuery.getType());
    return await handler.handle(playQuery.getQuery(), requesterId);
  }
}
