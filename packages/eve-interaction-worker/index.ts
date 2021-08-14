import logger from './src/util/logger';
import client from './src/structures/client';

process.on('SIGINT', () => {
  logger.notice('Got SIGINT exiting');
  client?.destroy();
  process.exit(0);
});
