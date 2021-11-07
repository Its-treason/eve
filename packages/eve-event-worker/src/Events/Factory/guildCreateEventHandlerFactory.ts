import { Container } from 'treason-di';
import Logger from '../../Util/Logger';
import GuildCreateEventHandler from '../GuildCreateEventHandler';

export default async function guildCreateEventHandlerFactory(container: Container): Promise<GuildCreateEventHandler> {
  const logger = await container.get<Logger>(Logger);

  return new GuildCreateEventHandler(logger);
}
