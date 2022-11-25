import { GatewayIntentBits, Client } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import SlashCommandInterface from '../SlashCommands/SlashCommandInterface';
import { injectAll, singleton } from 'tsyringe';
import EventHandlerInterface from '../EventHandler/EventHandlerInterface';
import { Logger } from '@eve/core';

@singleton()
export default class EveClient extends Client {
  private readonly slashCommands: SlashCommandInterface[];
  private readonly eventHandler: EventHandlerInterface[];
  private readonly logger: Logger;

  constructor(
    @injectAll('SlashCommands') slashCommands: SlashCommandInterface[],
    @injectAll('EventHandler') eventHandler: EventHandlerInterface[],
    logger: Logger,
  ) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.slashCommands = slashCommands;
    this.eventHandler = eventHandler;
    this.logger = logger;
  }

  public async run(): Promise<void|never> {
    this.registerEventHandler();
    await this.registerSlashCommands();

    try {
      await this.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      this.logger.emergency('Discord Login Failed', { error, isTokenSet: process.env.DISCORD_TOKEN !== undefined });
      throw error;
    }
  }

  registerEventHandler(): void {
    this.eventHandler.forEach((eventHandler): void => {
      this.on(eventHandler.getNameEventName(), (...payload: unknown[]) => eventHandler.execute(...payload));
    });
  }

  private async registerSlashCommands(): Promise<void> {
    const slashCommandsData = this.slashCommands.map((slashCommand) => slashCommand.getData());

    if (!process.env.DISCORD_TOKEN) {
      throw new Error('Env var "DISCORD_TOKEN" not set');
    }
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    if (!process.env.CLIENT_ID) {
      throw new Error('Env var "CLIENT_ID" not set');
    }
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] },
    );

    try {
      if (process.env.NODE_ENV === 'development') {
        if (!process.env.GUILD_ID) {
          throw new Error('Env var "GUILD_ID" not set');
        }
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
          { body: slashCommandsData },
        );
        return;
      }

      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: slashCommandsData },
      );
    } catch (error) {
      this.logger.error('Error during SlashCommand registration', { env: process.env.NODE_ENV, error });
      throw error;
    }
  }
}
