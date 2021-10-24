import { QueryResult } from '../../types';

export default abstract class AbstractQueryHandler {
  abstract handle(query: string, requesterId: string): Promise<QueryResult>;
}
