import YtResultService from '../YtResultService';
import { Container } from 'treason-di';
import AbstractQueryHandler from '../QueryHandler/AbstractQueryHandler';

export default async function YtResultServiceFactory(container: Container): Promise<YtResultService> {
  const handlers = await container.get<Map<string, AbstractQueryHandler>>('QueryHandler');

  return new YtResultService(handlers);
}
