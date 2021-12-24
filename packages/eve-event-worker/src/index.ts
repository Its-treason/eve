import 'reflect-metadata';
import injector from './injector';
import EveClient from './Structures/EveClient';
import Logger from './Util/Logger';

(async () => {
  const logger = injector.get(Logger);
  const client = injector.get(EveClient);

  const shutDown = () => {
    logger.notice('Got SIGINT or SIGTERM exiting');

    client?.destroy();
    process.exit(0);
  };
  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);

  const handleError = (error: Error) => {
    logger.error('An error occurred', { error });
  };
  process.on('uncaughtException', handleError);
  process.on('unhandledRejection', handleError);

  await client.run();
  logger.info('Started eve-event-worker');
})();
