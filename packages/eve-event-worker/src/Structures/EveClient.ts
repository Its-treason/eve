import { Intents, Client, ButtonInteraction, CommandInteraction } from 'discord.js';
import Logger from '../Util/Logger';
import AbstractEventHandler from '../Events/AbstractEventHandler';

export default class EveClient extends Client {
  private readonly eventHandler: AbstractEventHandler[];
  private readonly logger: Logger;

  constructor(
    eventHandler: AbstractEventHandler[],
    logger: Logger,
  ) {
    const intents = new Intents();
    intents.add('GUILDS');
    intents.add('GUILD_MESSAGES');
    intents.add('GUILD_VOICE_STATES');
    intents.add('GUILD_BANS');

    super({ intents });

    this.eventHandler = eventHandler;
    this.logger = logger;
  }

  public async run(): Promise<void|never> {
    await this.registerEventHandler();

    try {
      await this.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      this.logger.critical('Discord Login Failed', { error: (error as Error), isTokenSet: process.env.DISCORD_TOKEN !== undefined });
      process.exit(1);
    }
  }

  async registerEventHandler(): Promise<void> {
    this.eventHandler.forEach((eventHandler): void => {
      this.on(eventHandler.eventName, eventHandler.execute);
    });
  }
}
