import { Logger } from '@eve/core';
import { Status } from 'discord.js';
import EveClient from '../Structures/EveClient';

export default function registerErrorAndShutdownHandler(logger: Logger, client?: EveClient): void {
  // Add Shutdown handler for signals
  const shutDown = (exitCode = 0) => {
    logger.notice('Exiting', { exitCode });

    client?.destroy();
    process.exit(exitCode);
  };
  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);

  // Check every 5 seconds if the client is still connected
  setInterval(async () => {
    if (!client) {
      return;
    }

    try {
      await fetch('https://cdn.discordapp.com');
    } catch (e) {
      logger.emergency('Could not fetch from discord, killing container', { error: e });
      shutDown(1);
    }

    if (client.ws.status !== Status.Ready) {
      logger.emergency('Client is not ready anymore, killing container', {
        status: client.ws.status,
      });
      shutDown(1);
    }
  }, 10000);

  // Error handling
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
