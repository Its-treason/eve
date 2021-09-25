import { Container } from 'treason-di';
import { EventStore } from '../../eventStore/EventStore';
import PardonCommand from '../PardonCommand';

export default async function pardonCommandFactory(container: Container): Promise<PardonCommand> {
  const eventStore = await container.get<EventStore>(EventStore);

  return new PardonCommand(eventStore);
}
