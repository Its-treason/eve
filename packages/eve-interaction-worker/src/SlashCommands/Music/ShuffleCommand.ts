import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';
import { injectable } from 'tsyringe';

@injectable()
export default class ShuffleCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user);

    if (member.voice?.channelId !== player.getVoiceChannelId()) {
      const answer = embedFactory(interaction.client, 'Error!');
      answer.setDescription('You must be in the same voice channel as iam in');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    await interaction.deferReply();

    await player.shuffle();

    const answer = embedFactory(interaction.client, 'Shuffled the queue!');

    await interaction.editReply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'shuffle',
        description: 'shuffle the queue',
      options: [],
    };
  }
}
