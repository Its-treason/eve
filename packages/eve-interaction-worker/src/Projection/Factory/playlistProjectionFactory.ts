import { Pool } from 'mariadb';
import { Container } from 'treason-di';
import PlaylistProjection from '../PlaylistProjection';

export default async function playlistProjectionFactory(container: Container): Promise<PlaylistProjection> {
  const connection = await container.get<Pool>('Connection');

  return new PlaylistProjection(connection);
}
