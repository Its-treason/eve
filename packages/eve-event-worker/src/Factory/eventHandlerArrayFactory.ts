import { Container } from 'treason-di';
import AbstractEventHandler from '../Events/AbstractEventHandler';
import VoiceStateUpdateHandler from '../Events/VoiceStateUpdateHandler';
import RateLimitEventHandler from '../Events/RateLimitEventHandler';
import WarnEventHandler from '../Events/WarnEventHandler';
import GuildCreateEventHandler from '../Events/GuildCreateEventHandler';
import guildCreateEventHandlerFactory from '../Events/Factory/guildCreateEventHandlerFactory';
import GuildDeleteEventHandler from '../Events/GuildDeleteEventHandler';

export default async function eventHandlerArrayFactory(container: Container): Promise<AbstractEventHandler[]> {
  const eventHandler: AbstractEventHandler[] = [];

  eventHandler.push(await container.get<VoiceStateUpdateHandler>(VoiceStateUpdateHandler));
  eventHandler.push(await container.get<RateLimitEventHandler>(RateLimitEventHandler));
  eventHandler.push(await container.get<WarnEventHandler>(WarnEventHandler));
  eventHandler.push(await container.get<GuildCreateEventHandler>(GuildCreateEventHandler));
  eventHandler.push(await container.get<GuildDeleteEventHandler>(GuildDeleteEventHandler));

  return eventHandler;
}
