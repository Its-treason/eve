import { Container } from 'treason-di';
import RateLimitEventHandler from '../RateLimitEventHandler';
import Logger from '../../Util/Logger';

export default async function rateLimitEventHandlerFactory(container: Container): Promise<RateLimitEventHandler> {
  const logger = await container.get<Logger>(Logger);

  return new RateLimitEventHandler(logger);
}
