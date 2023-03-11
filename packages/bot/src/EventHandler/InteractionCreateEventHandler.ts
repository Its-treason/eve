import { ButtonInteraction, ChatInputCommandInteraction, Interaction } from 'discord.js';
import { injectable, injectAll } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import messageEmbedFactory from '../Factory/messageEmbedFactory';
import SlashCommandInterface from '../SlashCommands/SlashCommandInterface';
import ButtonInteractionInterface from '../ButtonInteractions/ButtonInteractionInterface';
import { Logger } from '@eve/core';

@injectable()
export default class InteractionCreateEventHandler implements EventHandlerInterface<'interactionCreate'> {
  constructor(
    @injectAll('SlashCommands') private slashCommands: SlashCommandInterface[],
    @injectAll('ButtonInteractions') private buttonInteractions: ButtonInteractionInterface[],
    private logger: Logger,
  ) {}

  getEventName() {
    return 'interactionCreate' as const;
  }

  public async execute(interaction: Interaction): Promise<void> {
    if (interaction.isButton()) {
      return this.handleButtonInteraction(interaction);
    }

    if (interaction.isChatInputCommand()) {
      return this.handleCommandInteraction(interaction);
    }

    this.logger.notice(
        'Got interaction with unknown type!',
        { type: interaction.type, userId: interaction.user.id },
    );
  }

  private async handleCommandInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
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
