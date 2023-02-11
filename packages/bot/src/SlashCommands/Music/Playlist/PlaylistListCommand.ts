import { ApplicationCommandSubCommandData, ChatInputCommandInteraction } from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import SubSlashCommandInterface from '../../SubSlashCommandInterface';
import { injectable } from 'tsyringe';
import { PlaylistRepository } from '@eve/core';

@injectable()
export default class PlaylistListCommand implements SubSlashCommandInterface {
  constructor(
    private playlistRepository: PlaylistRepository,
  ) {}

  getData(): ApplicationCommandSubCommandData {
    return {
      type: 1,
      name: 'list',
      description: 'List Playlists of a user',
      options: [
        {
          name: 'user',
          description: 'User to get the playlists from',
          required: false,
          type: 6,
        },
      ],
    };
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user', false) || interaction.user;
    const userId = user.id;

    const playlists = await this.playlistRepository.loadPlaylistsOfUser(userId);

    if (playlists.length === 0) {
      const answer = messageEmbedFactory(interaction.client, 'Error');
      answer.setDescription(`${user.username} does not has any Playlists saved!`);
      await interaction.reply({ embeds: [answer], allowedMentions: {} });
      return;
    }

    const playlistsList = playlists.reduce((acc, playlist) => {
      return acc + `\`${playlist}\`\n`;
    }, '');

    const answer = messageEmbedFactory(interaction.client, `${user.username} playlists:`);
    answer.setDescription(playlistsList);

    await interaction.reply({ embeds: [answer] });
  }
}
