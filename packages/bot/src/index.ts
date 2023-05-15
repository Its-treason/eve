import 'reflect-metadata';
import './dependencyDefinition';
import EveClient from './Structures/EveClient';
import { container } from 'tsyringe';
import registerErrorAndShutdownHandler from './Util/registerErrorAndShutdownHandler';
import { Logger } from '@eve/core';
import StorageMigrator from '@eve/storage-migration';

// Hack for BigInt serializtion
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

(async () => {
  const logger = container.resolve(Logger);
  const client = container.resolve(EveClient);

  const migrator = container.resolve(StorageMigrator);
  await migrator.migrateToLatest();

  registerErrorAndShutdownHandler(logger, client);

  try {
    await client.run();

    const channel = await client.channels.fetch('558316518602178563');
    if (!channel || !channel.isTextBased()) {
      return;
    }
    console.log(await channel.messages.fetch('1105589554582401074'));
  } catch (error) {
    logger.emergency('Could not start client', { error });
    return;
  }

  logger.info('Started eve-bot');
})();
