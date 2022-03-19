import { QueryResult } from '../types';
import AbstractQueryHandler from './QueryHandler/QueryHandlerInterface';
import PlayQuery from '../Value/PlayQuery';
import { injectable, injectAll } from 'tsyringe';

@injectable()
export default class YtResultService {
  constructor(
    @injectAll('QueryHandler') private handler: AbstractQueryHandler[],
  ) {
    this.handler = handler;
  }

  public async parseQuery(query: string, requesterId: string): Promise<QueryResult> {
    const playQuery = PlayQuery.fromQuery(query);

    const handler = this.handler.find((handler) => handler.getType() === playQuery.getType());
    return await handler.handle(playQuery.getQuery(), requesterId);
  }
}
