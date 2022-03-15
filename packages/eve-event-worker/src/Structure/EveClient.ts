import { Intents, Client } from 'discord.js';
import Logger from '../Util/Logger';
import { injectAll, singleton } from 'tsyringe';
import EventHandler from '../EventHandler/EventHandler';

@singleton()
export default class EveClient extends Client {
  private readonly eventHandler: EventHandler[];
  private readonly logger: Logger;

  constructor(
    @injectAll('EventHandler') eventHandler: EventHandler[],
    logger: Logger,
  ) {
    const intents = new Intents();
    intents.add(Intents.FLAGS.GUILDS);
    intents.add(Intents.FLAGS.GUILD_MEMBERS);
    intents.add(Intents.FLAGS.GUILD_VOICE_STATES);

    super({ intents });

    this.eventHandler = eventHandler;
    this.logger = logger;
  }

  public async run(): Promise<void|never> {
    this.registerEventHandler();

    try {
      await this.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      this.logger.emergency('Discord Login Failed', {
        error,
        isTokenSet: process.env.DISCORD_TOKEN !== undefined,
      });
      throw error;
    }
  }

  registerEventHandler(): void {
    this.eventHandler.forEach((eventHandler): void => {
      this.on(eventHandler.getNameEventName(), (...payload: unknown[]) => eventHandler.execute(...payload));
    });
  }
}
