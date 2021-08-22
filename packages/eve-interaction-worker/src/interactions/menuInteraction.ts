import {EveInteraction} from '../types';
import {ButtonInteraction, Interaction} from 'discord.js';
import embedFactory from '../util/embedFactory';

const interaction: EveInteraction = {
  name: 'menu',
  execute: async (args, interaction: Interaction) => {
    if (!(interaction instanceof ButtonInteraction)) {
      return;
    }

    const answer = embedFactory();
    const guild = interaction.guild;

    const roleId = args[1];
    const role = guild.roles.cache.get(`${BigInt(roleId)}`);
    const interactionUser = guild.members.cache.get(interaction.user.id);

    if (interactionUser.roles.cache.find(r => r.id === role.id)) {
      // TODO: Check if Bot has Permission to Remove role
      await interactionUser.roles.remove(role.id);

      answer.addField('Role Menu', `\`${role.name}\` removed`);
      await interaction.reply({
        embeds: [answer],
        ephemeral: true,
      });
      return;
    }

    // TODO: Check if Bot has Permission to Add role
    await interactionUser.roles.add(role.id);

    answer.addField('Role Menu', `\`${role.name}\` added`);
    await interaction.reply({
      embeds: [answer],
      ephemeral: true,
    });
  },
};

export default interaction;
