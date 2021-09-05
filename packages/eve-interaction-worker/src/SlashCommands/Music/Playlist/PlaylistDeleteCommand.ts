import {CommandInteraction} from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import PlaylistProjection from '../../../Projection/PlaylistProjection';
import AbstractSubSlashCommand from '../../AbstractSubSlashCommand';
import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';

export default class PlaylistDeleteCommand extends AbstractSubSlashCommand {
  constructor() {
    super({
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
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const name = interaction.options.getString('name', true);
    const userId = interaction.user.id;

    const playlists = await PlaylistProjection.loadPlaylistByNameAndUserId(name, userId);

    if (playlists === false) {
      const answer = messageEmbedFactory();
      answer.setTitle('This playlist does not exist!');
      await interaction.reply({embeds: [answer]});
      return;
    }

    await PlaylistProjection.deletePlaylist(name, userId);

    const answer = messageEmbedFactory();
    answer.setTitle('Playlist deleted!');

    await interaction.reply({embeds: [answer]});
  }
}
