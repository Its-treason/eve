import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, ApplicationCommandType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import messageEmbedFactory from '../../../Factory/messageEmbedFactory';
import SubSlashCommandInterface from '../../SubSlashCommandInterface';
import embedFactory from '../../../Factory/messageEmbedFactory';
import MusicPlayerRepository from '../../../MusicPlayer/MusicPlayerRepository';
import { injectable } from 'tsyringe';
import { MusicResult } from '../../../types';
import yasha from 'yasha';
import { MultiDownloader } from '../../../Util/MultiDownloader';
import { PlaylistItem, PlaylistRepository } from '@eve/core';

@injectable()
export default class PlaylistLoadCommand implements SubSlashCommandInterface {
  constructor(
    private playlistRepository: PlaylistRepository,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const playlistName = interaction.options.getString('name', true);
    const user = interaction.options.getUser('user', false) || interaction.user;
    const clear = interaction.options.getBoolean('clear', false) || false;
    const userId = user.id;

    const playlistItems = await this.playlistRepository.loadPlaylistByNameAndUserId(playlistName, userId);
    if (playlistItems === false) {
      const answer = messageEmbedFactory(interaction.client, 'Error');
      answer.setDescription('This playlist does not exist!');
      await interaction.reply({ embeds: [answer] });
      return; 
    }

    // TODO: Figure out why tf channel can be undefined in a *CHAT*InputCommand
    if (!interaction.inCachedGuild() || !interaction.channel) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('Command can not be executed inside DMs!');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    const member = await interaction.guild?.members.fetch(interaction.user);
    if (member?.voice.channel === null) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('You must be in a voice channel');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    if (!await MusicPlayerRepository.has(interaction.guild.id)) {
      MusicPlayerRepository.create(member.voice.channel, interaction.channel);
    }

    await interaction.deferReply();

    const player = await MusicPlayerRepository.get(interaction.guild.id);
    if (member.voice.channelId !== player?.getVoiceChannelId()) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('You must be in the same voice channel with me!');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    const queue = await this.createQueue(playlistItems, userId);
    const firstResult = queue[0];

    if (queue.length === 0 || !firstResult) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('The playlist you tried to load is empty!');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    if (clear === true) {
      await player.clear();
    }

    for (const item of queue) {
      await player.addToQueue(item);
    }

    const answer = embedFactory(interaction.client, `Loaded ${playlistName}!`);
    answer.setDescription(
      `\`${firstResult.title}\` uploaded by \`${firstResult.uploader}\` 
      and **${queue.length}** more songs were added to the queue`,
    );
    answer.addFields([{ name: 'Link', value: firstResult.url || 'N/A' }]);
    answer.setImage(`https://img.youtube.com/vi/${firstResult.ytId}/0.jpg`);
    await interaction.editReply({ embeds: [answer] });
  }

  private async createQueue(playlistItems: PlaylistItem[], requestedBy: string): Promise<MusicResult[]> {
    const results: (MusicResult|null)[] = [];

    const multiDownloader = new MultiDownloader<MusicResult|null>(30);

    for (const item of playlistItems) {
      const resultPromise = this.fetchMusicResult(item, requestedBy);

      results.push(...(await multiDownloader.download(resultPromise)));
    }

    results.push(...(await multiDownloader.flush()));

    return results.filter((result): result is MusicResult => result !== null);
  }

  private async fetchMusicResult(playlistItem: PlaylistItem, requestedBy: string): Promise<MusicResult|null> {
    // Getting the Track will sometimes throw an random error, this try catch mess will retry it once
    let track: yasha.api.Youtube.Track | null;
    try {
      track = await yasha.api.Youtube.get(playlistItem.ytId);
    } catch (e) {
      try {
        track = await yasha.api.Youtube.get(playlistItem.ytId);
      } catch (e) {
        return null;
      }
    }
    if (!track) {
      return null;
    }

    return {
      ...playlistItem,
      track,
      requestedBy,
    };
  }

  getData(): ApplicationCommandSubCommandData {
    return {
      name: 'load',
      description: 'Load Playlists of a user',
      type: ApplicationCommandOptionType.Subcommand,
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
    };
  }
}
