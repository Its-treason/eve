import logger from './src/util/Logger';
// Importing the Client here will Start Bot
import client from './src/structures/Client';

''.replaceAll('test', '');

const shutDown = () => {
  logger.notice('Got SIGINT or SIGTERM exiting');
  client?.destroy();
  process.exit(0);
};

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
