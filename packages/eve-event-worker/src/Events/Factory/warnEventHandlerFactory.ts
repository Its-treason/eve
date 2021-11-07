import { Container } from 'treason-di';
import WarnEventHandler from '../WarnEventHandler';
import Logger from '../../Util/Logger';

export default async function warnEventHandlerFactory(container: Container): Promise<WarnEventHandler> {
  const logger = await container.get<Logger>(Logger);

  return new WarnEventHandler(logger);
}
