import { Container } from 'treason-di';
import { EventStore } from '../../eventStore/EventStore';
import PardonInteraction from '../PardonInteraction';

export default async function pardonInteractionFactory(container: Container): Promise<PardonInteraction> {
  const eventStore = await container.get<EventStore>(EventStore);

  return new PardonInteraction(eventStore);
}
