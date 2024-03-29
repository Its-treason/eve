import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, ChatInputCommandInteraction } from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import SubSlashCommandInterface from '../../SubSlashCommandInterface';
import { injectable } from 'tsyringe';
import { PlaylistRepository } from '@eve/core';

@injectable()
export default class PlaylistDeleteCommand implements SubSlashCommandInterface {
  constructor(
    private playlistRepository: PlaylistRepository,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const name = interaction.options.getString('name', true);
    const userId = interaction.user.id;

    const playlists = await this.playlistRepository.loadPlaylistByNameAndUserId(name, userId);

    if (playlists === false) {
      const answer = messageEmbedFactory(interaction.client, 'Error');
      answer.setTitle('This playlist does not exist!');
      await interaction.reply({ embeds: [answer] });
      return;
    }

    await this.playlistRepository.deletePlaylist(name, userId);

    const answer = messageEmbedFactory(interaction.client, `Deleted the playlist \`${name}\``);

    await interaction.reply({ embeds: [answer] });
  }

  public getData(): ApplicationCommandSubCommandData {
    return {
      name: 'delete',
      description: 'Delete a playlist',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'name',
          description: 'Name of the Playlist to be deleted',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    };
  }
}
