import { Connection } from 'mariadb';
import { Container } from 'treason-di';
import { EventStore } from '../EventStore';

export default async function eventStoreFactory(container: Container): Promise<EventStore> {
  const mariadb = await container.get<Connection>('Connection');

  return new EventStore(mariadb);
}
