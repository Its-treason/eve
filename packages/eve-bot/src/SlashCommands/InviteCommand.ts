import embedFactory from '../Factory/messageEmbedFactory';
import SlashCommandInterface from './SlashCommandInterface';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { injectable } from 'tsyringe';

@injectable()
export default class InviteCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const invite = interaction.client.generateInvite(
      { scopes: ['applications.commands', 'bot'], permissions: 'ADMINISTRATOR' },
    );

    const answer = embedFactory(interaction.client, 'Invite Link');
    answer.setDescription(invite);
    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'invite',
      description: 'Create an invite to invite the bot to your server',
      options: [],
    };
  }
}
