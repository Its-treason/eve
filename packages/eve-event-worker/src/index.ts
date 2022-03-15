import 'reflect-metadata';
import './dependencyDefinition';
import EveClient from './Structure/EveClient';
import Logger from './Util/Logger';
import { container } from 'tsyringe';
import registerErrorAndShutdownHandler from './Util/registerErrorAndShutdownHandler';

(async () => {
  const logger = container.resolve(Logger);
  const client = container.resolve(EveClient);

  registerErrorAndShutdownHandler(logger, client);

  await client.run();
  logger.info('Started eve-event-worker');
})();
