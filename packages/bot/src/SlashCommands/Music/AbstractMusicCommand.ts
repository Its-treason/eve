import SlashCommandInterface from '../SlashCommandInterface';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

export default abstract class AbstractMusicCommand implements SlashCommandInterface {
  protected sameVc = true;
  protected playerExists = true;

  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('Command can not be executed inside DMs!');
      await interaction.reply({ embeds: [answer], ephemeral: true });
      return;
    }

    const player = await MusicPlayerRepository.get(interaction.guild.id);
    if (!player) {
      if (!this.playerExists) {
        return this.doExecute(interaction, null);
      }

      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('I\'m currently not playing any music');
      await interaction.reply({ embeds: [answer], ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user);
    if (member.voice.channelId !== player.getVoiceChannelId() && this.sameVc) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('You must be in the same voice channel as i\'m in');
      await interaction.reply({ embeds: [answer], ephemeral: true });
      return;
    }

    await this.doExecute(interaction, player);
  }

  abstract doExecute(interaction: CommandInteraction, player: MusicPlayer|null): Promise<void>

  public abstract getData(): ApplicationCommandData;
}
