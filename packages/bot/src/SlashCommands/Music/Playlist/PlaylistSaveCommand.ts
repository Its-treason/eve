import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, ChatInputCommandInteraction } from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import embedFactory from '../../../Factory/messageEmbedFactory';
import SubSlashCommandInterface from '../../SubSlashCommandInterface';
import { injectable } from 'tsyringe';
import MusicPlayerRepository from '../../../MusicPlayer/MusicPlayerRepository';
import { PlaylistItem, PlaylistRepository } from '@eve/core';

@injectable()
export default class PlaylistSaveCommand implements SubSlashCommandInterface {
  constructor(
    private playlistRepository: PlaylistRepository,
  ) {}

  getData(): ApplicationCommandSubCommandData {
    return {
      name: 'save',
      description: 'Save the current queue as a Playlist',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'name',
          description: 'Name of the playlist',
          required: true,
          type: 3,
        },
      ],
    };
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const name = String(interaction.options.get('name', true).value);
    const userId = interaction.user.id;

    if (!interaction.inCachedGuild() || !interaction.channel) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('Command can not be executed inside DMs!');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    if (name.length > 32) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('Name must not be longer than 32 characters!');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    const player = await MusicPlayerRepository.get(interaction.guild.id);
    if (player === null) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('I\'m currently not playing any music');
      await interaction.reply({ embeds: [answer], ephemeral: true });
      return;
    }

    const queue = player.getQueue();

    if (queue.length === 0) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('The queue is currently empty!');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    const ytResultQueue = queue.map((queueItem): PlaylistItem => {
      return {
        ytId: queueItem.ytId,
        url: queueItem.url,
        title: queueItem.title,
        uploader: queueItem.uploader,
      };
    });

    await this.playlistRepository.savePlaylist(name, userId, ytResultQueue);

    const answer = messageEmbedFactory(interaction.client, 'Saved Playlist!');

    await interaction.reply({ embeds: [answer] });
  }
}
