import { Container } from 'treason-di';
import { EventStore } from '../../eventStore/EventStore';
import BanCommand from '../BanCommand';

export default async function banCommandFactory(container: Container): Promise<BanCommand> {
  const eventStore = await container.get<EventStore>(EventStore);

  return new BanCommand(eventStore);
}
