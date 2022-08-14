import { Logger } from '@eve/core';
import EveClient from '../Structures/EveClient';

export default function registerErrorAndShutdownHandler(logger: Logger, client?: EveClient): void {
  const shutDown = (exitCode = 0) => {
    logger.notice('Exiting', { exitCode });

    client?.destroy();
    process.exit(exitCode);
  };
  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);

  let unhandledErrors = 0;

  const handleError = (error: Error) => {
    logger.error('An error occurred', { error });
    unhandledErrors++;
    setTimeout(() => {
      unhandledErrors--;
    }, 60000);
    if (unhandledErrors > 3) {
      logger.emergency('Too many errors occurred in a short interval');
      shutDown(1);
    }
  };
  process.on('uncaughtException', handleError);
  process.on('unhandledRejection', handleError);
}
