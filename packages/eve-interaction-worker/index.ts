import logger from './src/util/logger';
// Importing the Client here will Start Bot
import client from './src/structures/client';

const shutDown = () => {
  logger.notice('Got SIGINT or SIGTERM exiting');
  client?.destroy();
  process.exit(0);
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
