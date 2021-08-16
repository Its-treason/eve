import {ButtonInteraction, Collection, Interaction} from 'discord.js';
import {EveCommand, EveEvent, EveInteraction} from '../types';
import {readdirSync} from 'fs';
import logger from '../util/logger';

const interactions = new Collection<string, EveInteraction>();

const interactionFiles = readdirSync('./src/interactions');
interactionFiles.forEach((interactionFile) => {
  import(`../interactions/${interactionFile}`).then((importedCommand: {default: EveInteraction}) => {
    const interaction = importedCommand.default;

    interactions.set(interaction.name, interaction);
  });
});

const interactionCreate: EveEvent = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (interaction instanceof ButtonInteraction) {
      const args = interaction.customId.split('-');
      const interactionString = args.shift();

      if (!interactions.has(interactionString)) {
        logger.error('Got unknown interaction', {name: interactionString, customId: interaction.customId});
        return;
      }

      let interactionHandler: EveInteraction;
      try {
        interactionHandler = interactions.get(interactionString);
        await interactionHandler.execute(args, interaction);
      } catch (error) {
        logger.error('Error while executing interaction', {interactionHandlerName: interactionHandler.name, error});
      }
    }
  },
};

export default interactionCreate;
