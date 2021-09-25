import { Container } from 'treason-di';
import { EventStore } from '../../eventStore/EventStore';
import BanInteraction from '../BanInteraction';

export default async function banInteractionFactory(container: Container): Promise<BanInteraction> {
  const eventStore = await container.get<EventStore>(EventStore);

  return new BanInteraction(eventStore);
}
