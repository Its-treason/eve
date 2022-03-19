import { QueryResult } from '../../types';

export default interface QueryHandlerInterface {
  handle(query: string, requesterId: string): Promise<QueryResult>;

  getType(): string;
}
