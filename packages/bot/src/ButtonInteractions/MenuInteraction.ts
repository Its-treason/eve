import { PublicLogCategories, PublicLogsRepository } from '@eve/core';
import { ButtonInteraction, EmbedBuilder, GuildMember, Role } from 'discord.js';
import { singleton } from 'tsyringe';
import embedFactory from '../Factory/messageEmbedFactory';
import ButtonInteractionInterface from './ButtonInteractionInterface';

@singleton()
export default class MenuInteraction implements ButtonInteractionInterface {
  constructor(
    private publicLogger: PublicLogsRepository,
  ) {}

  getName(): string {
    return 'menu';
  }

  async execute(args: string[], interaction: ButtonInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      return;
    }

    const answer = embedFactory(interaction.client, 'Role-Menu');
    const guild = interaction.guild;

    const roleId = args[1];
    const role = guild.roles.cache.get(`${BigInt(roleId)}`);
    const interactionUser = guild.members.cache.get(interaction.user.id);
    if (!interactionUser || !role) {
      return;
    }

    if (interactionUser.roles.cache.find(r => r.id === role.id)) {
      this.removeRole(interactionUser, interaction, role, answer);
    }
    this.addRole(interactionUser, interaction, role, answer);
  }

  private async addRole(
    interactionUser: GuildMember,
    interaction: ButtonInteraction<"cached">,
    role: Role,
    answer: EmbedBuilder,
  ): Promise<void> {
    try {
      await interactionUser.roles.add(role.id);
    } catch (e) {
      answer.addFields([{
        name: 'Error',
        value: `I couldn't give you the \`${role.name}\` role. Because i don't have enough permission.`,
      }]);
      await interaction.reply({
        embeds: [answer],
        ephemeral: true,
      });
      return;
    }

    answer.addFields([{ name: 'Role added', value: `\`${role.name}\` added` }]);
    await interaction.reply({
      embeds: [answer],
      ephemeral: true,
    });
    await this.publicLogger.createLog(
      `"${interactionUser.user.username}" used a role menu to get the "${role.name}" role`,
      PublicLogCategories.AutoActionExecuted,
      [interaction.guildId],
      [interactionUser.id],
    );
  }

  private async removeRole(
    interactionUser: GuildMember,
    interaction: ButtonInteraction<"cached">,
    role: Role,
    answer: EmbedBuilder,
  ): Promise<void> {
    try {
      await interactionUser.roles.remove(role.id);
    } catch (e) {
      answer.addFields([{
        name: 'Error',
        value: `I couldn't remove your \`${role.name}\` role. Because i don't have enough permission.`,
      }]);
      await interaction.reply({
        embeds: [answer],
        ephemeral: true,
      });
      return;
    }

    answer.addFields([{ name: 'Role removed', value: `\`${role.name}\` removed` }]);
    await interaction.reply({
      embeds: [answer],
      ephemeral: true,
    });
    await this.publicLogger.createLog(
      `"${interactionUser.user.username}" used a role menu to remove the "${role.name}" role`,
      PublicLogCategories.AutoActionExecuted,
      [interaction.guildId],
      [interactionUser.id],
    );
  }
}
