import PlayQuery from '../value/PlayQuery';
import { PlaylistItem } from '../web/sharedApiTypes';
import getQueryHandler from '../structures/getQueryHandler';

export default class YtResultService {
  public static async parseQuery(playQuery: PlayQuery, requesterId: string): Promise<PlaylistItem[]> {
    const handlers = getQueryHandler();

    const handler = handlers.get(playQuery.getType());
    if (!handler) {
      throw new Error('Undefined SearchHandler!');
    }
    return await handler.handle(playQuery.getQuery(), requesterId);
  }
}
