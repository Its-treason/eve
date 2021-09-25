import { Container } from 'treason-di';
import { EventStore } from '../../eventStore/EventStore';
import MenuInteraction from '../MenuInteraction';

export default async function menuInteractionFactory(container: Container): Promise<MenuInteraction> {
  const eventStore = await container.get<EventStore>(EventStore);

  return new MenuInteraction(eventStore);
}
