import { ApplicationCommandSubCommandData, CommandInteraction } from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import PlaylistProjection from '../../../Projection/PlaylistProjection';
import SubSlashCommandInterface from '../../SubSlashCommandInterface';
import { injectable } from 'tsyringe';

@injectable()
export default class PlaylistDeleteCommand implements SubSlashCommandInterface {
  constructor(
    private playlistProjection: PlaylistProjection,
  ) {}

  async execute(interaction: CommandInteraction): Promise<void> {
    const name = interaction.options.getString('name', true);
    const userId = interaction.user.id;

    const playlists = await this.playlistProjection.loadPlaylistByNameAndUserId(name, userId);

    if (playlists === false) {
      const answer = messageEmbedFactory(interaction.client, 'Error');
      answer.setTitle('This playlist does not exist!');
      await interaction.reply({ embeds: [answer] });
      return;
    }

    await this.playlistProjection.deletePlaylist(name, userId);

    const answer = messageEmbedFactory(interaction.client, `Deleted the playlist \`${name}\``);

    await interaction.reply({ embeds: [answer] });
  }

  public getData(): ApplicationCommandSubCommandData {
    return {
      type: 1,
      name: 'delete',
      description: 'Delete a playlist',
      options: [
        {
          name: 'name',
          description: 'Name of the Playlist to be deleted',
          type: 3,
          required: true,
        },
      ],
    };
  }
}
