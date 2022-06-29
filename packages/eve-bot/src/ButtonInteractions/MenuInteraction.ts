import { ButtonInteraction } from 'discord.js';
import embedFactory from '../Factory/messageEmbedFactory';
import ButtonInteractionInterface from './ButtonInteractionInterface';

export default class MenuInteraction implements ButtonInteractionInterface {
  getName(): string {
    return 'menu';
  }

 async execute(args: string[], interaction: ButtonInteraction): Promise<void> {
    const answer = embedFactory(interaction.client, 'Role-Menu');
    const guild = interaction.guild;

    const roleId = args[1];
    const role = guild.roles.cache.get(`${BigInt(roleId)}`);
    const interactionUser = guild.members.cache.get(interaction.user.id);

    if (interactionUser.roles.cache.find(r => r.id === role.id)) {
      try {
        await interactionUser.roles.remove(role.id);
      } catch (e) {
        answer.addField(
          'Error',
          `I couldn't remove your \`${role.name}\` role. Because i don't have enough permission.`,
        );
        await interaction.reply({
          embeds: [answer],
          ephemeral: true,
        });
        return;
      }

      answer.addField('Role removed', `\`${role.name}\` removed`);
      await interaction.reply({
        embeds: [answer],
        ephemeral: true,
      });
      return;
    }

    try {
      await interactionUser.roles.add(role.id);
    } catch (e) {
      answer.addField(
        'Error',
        `I couldn't give you the \`${role.name}\` role. Because i don't have enough permission.`,
      );
      await interaction.reply({
        embeds: [answer],
        ephemeral: true,
      });
      return;
    }

    answer.addField('Role added', `\`${role.name}\` added`);
    await interaction.reply({
      embeds: [answer],
      ephemeral: true,
    });
  }
}
