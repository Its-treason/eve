import { CommandInteraction } from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import PlaylistProjection from '../../../Projection/PlaylistProjection';
import AbstractSubSlashCommand from '../../AbstractSubSlashCommand';

export default class PlaylistListCommand extends AbstractSubSlashCommand {
  private readonly playlistProjection: PlaylistProjection;

  constructor(playlistProjection: PlaylistProjection) {
    super({
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
    });

    this.playlistProjection = playlistProjection;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user') || interaction.user;
    const userId = user.id;

    const playlists = await this.playlistProjection.loadPlaylistsOfUser(userId);

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
