import embedFactory from '../Factory/messageEmbedFactory';
import SlashCommandInterface from './SlashCommandInterface';
import { ApplicationCommandData, ApplicationCommandType, CommandInteraction, OAuth2Scopes } from 'discord.js';
import { injectable } from 'tsyringe';

@injectable()
export default class InviteCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const invite = interaction.client.generateInvite(
      {
        scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
        permissions: 'Administrator',
      },
    );

    const answer = embedFactory(interaction.client, 'Invite Link');
    answer.setDescription(invite);
    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'invite',
      description: 'Create an invite to invite the bot to your server',
      type: ApplicationCommandType.ChatInput,
      options: [],
    };
  }
}
