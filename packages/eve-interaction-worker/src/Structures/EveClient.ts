import {Intents, Client, ButtonInteraction, CommandInteraction, Interaction} from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import SlashCommandInterface from '../SlashCommands/SlashCommandInterface';
import ButtonInteractionInterface from '../ButtonInteractions/ButtonInteractionInterface';
import Logger from '../Structures/Logger';
import messageEmbedFactory from '../Factory/messageEmbedFactory';
import { injectable, injectAll } from 'tsyringe';

@injectable()
export default class EveClient extends Client {
  private readonly slashCommands: SlashCommandInterface[];
  private readonly buttonInteractions: ButtonInteractionInterface[];
  private readonly logger: Logger;

  constructor(
    @injectAll('SlashCommands') slashCommands: SlashCommandInterface[],
    @injectAll('ButtonInteractions') buttonInteractions: ButtonInteractionInterface[],
    logger: Logger,
  ) {
    const intents = new Intents();
    intents.add('GUILDS');
    intents.add('GUILD_VOICE_STATES');
    intents.add('GUILD_BANS');

    super({ intents });

    this.slashCommands = slashCommands;
    this.buttonInteractions = buttonInteractions;
    this.logger = logger;
  }

  public async run(): Promise<void|never> {
    this.on('interactionCreate', this.handleInteraction);
    await this.registerSlashCommands();

    try {
      await this.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      this.logger.emergency('Discord Login Failed', { error, isTokenSet: process.env.DISCORD_TOKEN !== undefined });
      throw error;
    }
  }

  private async registerSlashCommands(): Promise<void> {
    const slashCommandsData = this.slashCommands.map((slashCommand) => slashCommand.getData());

    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] },
    );

    try {
      if (process.env.NODE_ENV === 'development') {
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

  private async handleInteraction(interaction: Interaction): Promise<void> {
    if (interaction.isButton()) {
      return this.handleButtonInteraction(interaction);
    }

    if (interaction.isCommand()) {
      return this.handleCommandInteraction(interaction);
    }

    this.logger.notice(
      'Got interaction with unknown type!',
      { type: interaction.type, userId: interaction.user.id },
    )
  }

  private async handleCommandInteraction(interaction: CommandInteraction): Promise<void> {
    this.logger.info('Handling SlashCommand', {
      commandName: interaction.commandName,
      serverId: interaction.guild?.id,
      serverName: interaction.guild?.name,
      userId: interaction.user.id,
      userName: interaction.user.username,
    });

    const slashCommand = this.slashCommands.find(slashCommand => slashCommand.getData().name === interaction.commandName);

    if (!slashCommand) {
      this.logger.warning('Got unknown SlashCommand interaction', { name: interaction.commandName });
      await interaction.reply({ content: 'Unknown Command', ephemeral: true });
      return;
    }

    try {
      await slashCommand.execute(interaction);
    } catch (error) {
      this.logger.error(
        'Error while executing SlashCommand',
        { interactionHandlerName: slashCommand.getData().name, error },
      );

      const answer = messageEmbedFactory(interaction.client, 'An error occurred');
      answer.setDescription('Uhm, this is embarrassing. An error occurred while executing this command.');

      if (interaction.deferred) {
        await interaction.editReply({ embeds: [answer] });
        return;
      }
      await interaction.reply({
        embeds: [answer],
        ephemeral: true,
      });
    }
  }

  private async handleButtonInteraction(interaction: ButtonInteraction): Promise<void> {
    this.logger.info('Handling ButtonInteraction', {
      customId: interaction.customId,
      serverId: interaction.guild?.id,
      serverName: interaction.guild?.name,
      userId: interaction.user.id,
      userName: interaction.user.username,
    });

    const args = interaction.customId.split('-');
    const interactionString = args.shift();

    const interactionHandler = this.buttonInteractions.find(
      (buttonInteraction) => buttonInteraction.getName() === interactionString,
    );

    if (!interactionHandler) {
      this.logger.warning('Got unknown interaction', { name: interactionString, customId: interaction.customId });
      return;
    }

    try {
      await interactionHandler.execute(args, interaction);
    } catch (error) {
      this.logger.error(
        'Error while executing interaction',
        { interactionHandlerName: interactionHandler.getName(), error },
      );
    }
  }
}
