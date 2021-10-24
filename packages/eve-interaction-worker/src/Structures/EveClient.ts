import { Intents, Client, ButtonInteraction, CommandInteraction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import AbstractSlashCommand from '../SlashCommands/AbstractSlashCommand';
import AbstractButtonInteraction from '../ButtonInteractions/AbstractInteraction';
import Logger from '../Util/Logger';
import messageEmbedFactory from '../Factory/messageEmbedFactory';

export default class EveClient extends Client {
  private readonly slashCommands: AbstractSlashCommand[];
  private readonly slashCommandMap: Map<string, AbstractSlashCommand>;
  private readonly buttonInteractionMap: Map<string, AbstractButtonInteraction>;
  private readonly logger: Logger;

  constructor(
    slashCommands: AbstractSlashCommand[],
    buttonInteraction: AbstractButtonInteraction[],
    logger: Logger,
  ) {
    const intents = new Intents();
    intents.add('GUILDS');
    intents.add('GUILD_MESSAGES');
    intents.add('GUILD_VOICE_STATES');
    intents.add('GUILD_BANS');

    super({ intents });

    this.slashCommandMap = slashCommands.reduce<Map<string, AbstractSlashCommand>>((map, slashCommand) =>{
       map.set(slashCommand.data.name, slashCommand);
       return map;
    }, new Map<string, AbstractSlashCommand>());
    this.slashCommands = slashCommands;

    this.buttonInteractionMap = buttonInteraction.reduce<Map<string, AbstractButtonInteraction>>((map, slashCommand) =>{
      map.set(slashCommand.name, slashCommand);
      return map;
   }, new Map<string, AbstractButtonInteraction>());

    this.logger = logger;
  }

  public async run(): Promise<void|never> {
    this.on('interactionCreate', this.handleInteraction);
    await this.registerSlashCommands();

    try {
      await this.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      this.logger.critical('Discord Login Failed', { error, isTokenSet: process.env.DISCORD_TOKEN !== undefined });
      process.exit(1);
    }
  }

  private async registerSlashCommands(): Promise<void> {
    const slashCommandsData = this.slashCommands.map((slashCommand) => slashCommand.data);

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
      this.logger.error('Error during SlashCommand registration', { env: process.env.NODE_ENV });
      throw error;
    }
  }

  private async handleInteraction(interaction: CommandInteraction): Promise<void> {
    if (interaction instanceof ButtonInteraction) {
      this.logger.info('Handling ButtonInteraction', {
        customId: interaction.customId,
        serverId: interaction.guild.id,
        serverName: interaction.guild.name,
        userId: interaction.user.id,
        userName: interaction.user.username,
      });

      const args = interaction.customId.split('-');
      const interactionString = args.shift();

      if (!this.buttonInteractionMap.has(interactionString)) {
        this.logger.warning('Got unknown interaction', { name: interactionString, customId: interaction.customId });
        return;
      }

      const interactionHandler = this.buttonInteractionMap.get(interactionString);
      try {
        await interactionHandler.execute(args, interaction);
      } catch (error) {
        this.logger.error(
          'Error while executing interaction',
          { interactionHandlerName: interactionHandler.name, error },
        );
      }
    }

    if (interaction instanceof CommandInteraction) {
      this.logger.info('Handling SlashCommand', {
        commandName: interaction.commandName,
        serverId: interaction.guild.id,
        serverName: interaction.guild.name,
        userId: interaction.user.id,
        userName: interaction.user.username,
      });

      if (!this.slashCommandMap.has(interaction.commandName)) {
        this.logger.warning('Got unknown SlashCommand interaction', { name: interaction.commandName });
        await interaction.reply({ content: 'Unknown Command', ephemeral: true });
        return;
      }

      const slashCommand = this.slashCommandMap.get(interaction.commandName);

      try {
        await slashCommand.execute(interaction);
      } catch (error) {
        this.logger.error(
          'Error while executing SlashCommand',
          { interactionHandlerName: slashCommand.data.name, error },
        );

        const answer = messageEmbedFactory(interaction.client, 'Error');
        answer.setDescription('Uhm, there was an error executing this command');

        if (interaction.deferred === true) {
          await interaction.editReply({ embeds: [answer] });
          return;
        }
        await interaction.reply({
          embeds: [answer],
          ephemeral: true,
        });
      }
    }
  }
}
