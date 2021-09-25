import AbstractButtonInteraction from '../ButtonInteractions/AbstractInteraction';
import { Container } from 'treason-di';
import AbstractSlashCommand from '../SlashCommands/AbstractSlashCommand';
import EveClient from '../Structures/EveClient';
import Logger from '../Util/Logger';

export default async (container: Container): Promise<EveClient> => {
  const slashCommands = await container.get<AbstractSlashCommand[]>('SlashCommands');
  const buttonInteractions = await container.get<AbstractButtonInteraction[]>('ButtonInteraction');
  const logger = await container.get<Logger>(Logger);

  const client = new EveClient(slashCommands, buttonInteractions, logger);
  return client;
};
