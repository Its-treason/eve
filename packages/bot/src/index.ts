import 'reflect-metadata';
import './dependencyDefinition';
import EveClient from './Structures/EveClient';
import { container } from 'tsyringe';
import registerErrorAndShutdownHandler from './Util/registerErrorAndShutdownHandler';
import { Logger } from '@eve/core';
import StorageMigrator from '@eve/storage-migration';

(async () => {
  const logger = container.resolve(Logger);
  const client = container.resolve(EveClient);

  const migrator = container.resolve(StorageMigrator); 
  await migrator.migrateToLatest();

  registerErrorAndShutdownHandler(logger, client);

  await client.run();
  logger.info('Started eve-bot');
})();
