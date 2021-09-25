import { Container } from 'treason-di';
import { EventStore } from '../../eventStore/EventStore';
import KickInteraction from '../KickInteraction';

export default async function kickInteractionFactory(container: Container): Promise<KickInteraction> {
  const eventStore = await container.get<EventStore>(EventStore);

  return new KickInteraction(eventStore);
}
