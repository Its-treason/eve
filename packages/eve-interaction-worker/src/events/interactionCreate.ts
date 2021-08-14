import {Collection, Interaction, Message} from 'discord.js';
import {EveEvent} from '../types';

const interactionCreate: EveEvent = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    console.log(interaction);
  },
};

export default interactionCreate;
