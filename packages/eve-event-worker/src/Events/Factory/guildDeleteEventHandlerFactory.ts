import { Container } from 'treason-di';
import Logger from '../../Util/Logger';
import GuildDeleteEventHandler from '../GuildDeleteEventHandler';

export default async function guildDeleteEventHandlerFactory(container: Container): Promise<GuildDeleteEventHandler> {
  const logger = await container.get<Logger>(Logger);

  return new GuildDeleteEventHandler(logger);
}
