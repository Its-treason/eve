import { MusicPlayer } from '../MusicPlayer/MusicPlayer';
import { CommandInteraction } from 'discord.js';
import embedFactory from '../Factory/messageEmbedFactory';
import MusicPlayerRepository from '../MusicPlayer/MusicPlayerRepository';

export default async function validateCanGetPlayer(interaction: CommandInteraction, sameVc = true): Promise<MusicPlayer|false> {
  if (interaction.guild === null) {
    const answer = embedFactory(interaction.client, 'Error');
    answer.setDescription('Command can not be executed inside DMs!');
    await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
    return false;
  }

  if (MusicPlayerRepository.has(interaction.guild.id) === false) {
    const answer = embedFactory(interaction.client, 'Error');
    answer.setDescription('Iam currently not playing any music');
    await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
    return false;
  }

  const player = MusicPlayerRepository.get(interaction.guild.id);

  const member = await interaction.guild.members.fetch(interaction.user);

  if (member.voice.channelId !== player.getVoiceChannelId() && sameVc === true) {
    const answer = embedFactory(interaction.client, 'Error');
    answer.setDescription('You must be in the same voice channel as iam in');
    await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
    return false;
  }

  return player;
}
