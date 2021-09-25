import { Pool } from 'mariadb';
import { Container } from 'treason-di';
import ChannelActivityProjection from '../../Projection/ChannelActivityProjection';

export default async function voiceStateUpdateHandlerFactory(container: Container): Promise<ChannelActivityProjection> {
  const connection = await container.get<Pool>('Connection');

  return new ChannelActivityProjection(connection);
}
