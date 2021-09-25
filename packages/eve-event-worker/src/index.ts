import definitions from './definitions';
import { Container } from 'treason-di';
import EveClient from './Structures/EveClient';
import Logger from './Util/Logger';

(async () => {
  const container = new Container(definitions);
  const logger = await container.get<Logger>(Logger);
  const client = await container.get<EveClient>(EveClient);

  const shutDown = () => {
    logger.notice('Got SIGINT or SIGTERM exiting');

    client?.destroy();
    process.exit(0);
  };

  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);

  await client.run();
  logger.info('Startet client');
})();
