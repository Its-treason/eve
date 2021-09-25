import { Container } from 'treason-di';
import EveClient from '../Structures/EveClient';
import Logger from '../Util/Logger';
import AbstractEventHandler from '../Events/AbstractEventHandler';

export default async (container: Container): Promise<EveClient> => {
  const eventHandler = await container.get<AbstractEventHandler[]>('EventHandler');
  const logger = await container.get<Logger>(Logger);

  const client = new EveClient(eventHandler, logger);
  return client;
};
