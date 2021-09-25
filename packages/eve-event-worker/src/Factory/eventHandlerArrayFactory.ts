import { Container } from 'treason-di';
import AbstractEventHandler from '../Events/AbstractEventHandler';
import VoiceStateUpdateHandler from '../Events/VoiceStateUpdateHandler';

export default async function eventHandlerArrayFactory(container: Container): Promise<AbstractEventHandler[]> {
  const eventHandler: AbstractEventHandler[] = [];

  eventHandler.push(await container.get<VoiceStateUpdateHandler>(VoiceStateUpdateHandler));

  return eventHandler;
}
