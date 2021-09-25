import embedFactory from '../Factory/messageEmbedFactory';
import AbstractSlashCommand from './AbstractSlashCommand';
import { CommandInteraction } from 'discord.js';

export default class InviteCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'invite',
      description: 'Create an invite to invite the bot to your server',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const invite = interaction.client.generateInvite(
      { scopes: ['applications.commands'], permissions: 'ADMINISTRATOR' },
    );

    const answer = embedFactory(interaction.client, 'Invite Link');
    answer.setDescription(invite);
    interaction.reply({ embeds: [answer] });
  }
}
