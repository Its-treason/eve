import { Container } from 'treason-di';
import { EventStore } from '../../eventStore/EventStore';
import KickCommand from '../KickCommand';

export default async function kickCommandFactory(container: Container): Promise<KickCommand> {
  const eventStore = await container.get<EventStore>(EventStore);

  return new KickCommand(eventStore);
}
