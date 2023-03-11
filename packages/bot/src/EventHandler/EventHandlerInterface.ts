import { ClientEvents } from 'discord.js';

export default interface EventHandlerInterface<K extends keyof ClientEvents> {
  getEventName(): K;

  execute(...payload: ClientEvents[K]): Promise<void>;
// eslint-disable-next-line semi
}
