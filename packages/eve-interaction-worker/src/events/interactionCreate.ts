import {ButtonInteraction, Collection, CommandInteraction, Interaction} from 'discord.js';
import {EveEvent, EveInteraction} from '../types';
import Logger from '../Util/Logger';

import slashCommandArrayFactory from '../Factory/slashCommandArrayFactory';
import AbstractSlashCommand from '../SlashCommands/AbstractSlashCommand';
import interactionArrayFactory from '../Factory/interactionArrayFactory';
import AbstractInteraction from '../Interactions/AbstractInteraction';

const interactionsArray = interactionArrayFactory();
const interactions = interactionsArray.reduce(
  (collection, interaction): Collection<string, AbstractInteraction> => {
    collection.set(interaction.name, interaction);
    return collection;
  },
  new Collection<string, AbstractInteraction>(),
);

const slashCommandsArray = slashCommandArrayFactory();
const slashCommands = slashCommandsArray.reduce(
  (collection, slashCommand): Collection<string, AbstractSlashCommand> => {
    collection.set(slashCommand.data.name, slashCommand);
    return collection;
  },
  new Collection<string, AbstractSlashCommand>(),
);

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
