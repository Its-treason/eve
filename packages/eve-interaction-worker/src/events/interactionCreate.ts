import {ButtonInteraction, Collection, CommandInteraction, Interaction} from 'discord.js';
import {EveSlashCommand, EveEvent, EveInteraction} from '../types';
import Logger from '../util/logger';
// Import all InteractionHandler
import banInteraction from '../interactions/banInteraction';
import kickInteraction from '../interactions/kickInteraction';
import pardonInteraction from '../interactions/pardonInteraction';
import menuInteraction from '../interactions/menuInteraction';
// Import all SlashCommands
import banCommand from '../slashCommands/banCommand';
import kickCommand from '../slashCommands/kickCommand';
import pardonCommand from '../slashCommands/pardonCommand';
import whoisCommand from '../slashCommands/whoisCommand';
import bonkCommand from '../slashCommands/bonkCommand';
import avatarCommand from '../slashCommands/avatarCommand';

const interactions = new Collection<string, EveInteraction>();
interactions.set(banInteraction.name, banInteraction);
interactions.set(kickInteraction.name, kickInteraction);
interactions.set(pardonInteraction.name, pardonInteraction);
interactions.set(menuInteraction.name, menuInteraction);

const slashCommands = new Collection<string, EveSlashCommand>();
slashCommands.set(banCommand.data.name, banCommand);
slashCommands.set(kickCommand.data.name, kickCommand);
slashCommands.set(pardonCommand.data.name, pardonCommand);
slashCommands.set(whoisCommand.data.name, whoisCommand);
slashCommands.set(bonkCommand.data.name, bonkCommand);
slashCommands.set(avatarCommand.data.name, avatarCommand);

const interactionCreate: EveEvent = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (interaction instanceof ButtonInteraction) {
      const args = interaction.customId.split('-');
      const interactionString = args.shift();

      if (!interactions.has(interactionString)) {
        Logger.warning('Got unknown interaction', {name: interactionString, customId: interaction.customId});
        return;
      }

      let interactionHandler: EveInteraction;
      try {
        interactionHandler = interactions.get(interactionString);
        await interactionHandler.execute(args, interaction);
      } catch (error) {
        Logger.error(
          'Error while executing interaction',
          {interactionHandlerName: interactionHandler.name, error},
        );
      }
    }

    if (interaction instanceof CommandInteraction) {
      if (!slashCommands.has(interaction.commandName)) {
        Logger.warning('Got unknown SlashCommand interaction', {name: interaction.commandName});
        await interaction.reply({content: 'Unknown Command', ephemeral: true});
        return;
      }

      const slashCommand = slashCommands.get(interaction.commandName);

      try {
        await slashCommand.execute(interaction);
      } catch (error) {
        Logger.error(
          'Error while executing SlashCommand',
          {interactionHandlerName: slashCommand.data.name, error},
        );
      }
    }
  },
};

export default interactionCreate;
