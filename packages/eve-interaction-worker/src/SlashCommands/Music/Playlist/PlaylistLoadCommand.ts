import { CommandInteraction } from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import PlaylistProjection from '../../../Projection/PlaylistProjection';
import AbstractSubSlashCommand from '../../AbstractSubSlashCommand';
import embedFactory from '../../../Factory/messageEmbedFactory';
import MusicPlayerRepository from '../../../MusicPlayer/MusicPlayerRepository';

export default class PlaylistLoadCommand extends AbstractSubSlashCommand {
  constructor(
    private playlistProjection: PlaylistProjection,
  ) {
    super({
      type: 1,
      name: 'load',
      description: 'Load Playlists of a user',
      options: [
        {
          name: 'name',
          description: 'Name of the Playlist',
          required: true,
          type: 3,
        },
        {
          name: 'user',
          description: 'User to get the playlists from',
          required: false,
          type: 6,
        },
        {
          name: 'clear',
          description: 'clear the current queue. Default is: false',
          required: false,
          type: 5,
        },
      ],
    });

    this.playlistProjection = playlistProjection;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const name = interaction.options.getString('name');
    const user = interaction.options.getUser('user') || interaction.user;
    const clear = interaction.options.getBoolean('clear') || false;
    const userId = user.id;

    const queue = await this.playlistProjection.loadPlaylistByNameAndUserId(name, userId);

    if (queue === false) {
      const answer = messageEmbedFactory(interaction.client, 'Error');
      answer.setDescription('This playlist does not exist!');
      await interaction.reply({ embeds: [answer] });
      return; 
    }

    if (
      interaction.guild === null ||
      (interaction.channel.type !== 'GUILD_TEXT' && interaction.channel.type !== 'GUILD_PUBLIC_THREAD')
    ) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('Command can not be executed inside DMs!');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user);

    if (member.voice.channel === null) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('You must be in a voice channel');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    if (!MusicPlayerRepository.has(interaction.guild.id)) {
      MusicPlayerRepository.create(member.voice.channel, interaction.channel);
    }

    await interaction.deferReply();

    const player = MusicPlayerRepository.get(interaction.guild.id);

    if (member.voice.channelId !== player.getVoiceChannelId()) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('You must be in the same voice channel as iam in');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    if (clear === true) {
      await player.clear();
    }

    for (const item of queue) {
      await player.addToQueue(item);
    }

    const answer = embedFactory(interaction.client, 'Loaded the playlist!');

    await interaction.editReply({ embeds: [answer] });
  }
}
