import { CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import { YtResult } from '../../types';
import YtResultService from '../../MusicPlayer/YtResultService';

export default class PlayCommand extends AbstractSlashCommand {
  private ytResultService: YtResultService;

  constructor(ytResultService: YtResultService) {
    super({
      name: 'play',
      description: 'Play some YT video',
      options: [
        {
          name: 'query',
          description: 'Search Query / Youtube URL',
          type: 3,
          required: true,
        },
      ],
    });

    this.ytResultService = ytResultService;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
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

    const query = interaction.options.getString('query', true);

    if (!await MusicPlayerRepository.has(interaction.guild.id)) {
      MusicPlayerRepository.create(member.voice.channel, interaction.channel);
    }

    await interaction.deferReply();

    const player = await MusicPlayerRepository.get(interaction.guild.id);

    if (member.voice.channelId !== player.getVoiceChannelId()) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('You must be in the same voice channel as iam in');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    const parsedUrls: YtResult[] = [];
    try {
      const result = await this.ytResultService.parseQuery(query, interaction.user.id);
      parsedUrls.push(...result);
    } catch (error) {
      console.error(error);
      
      const answer = embedFactory(interaction.client, 'Error!');
      answer.setDescription('There was an error getting the YouTube result. Is the link correct?');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    for (const parsedUrl of parsedUrls) {
      await player.addToQueue(parsedUrl);
    }

    const answer = embedFactory(interaction.client, 'Added to Queue!');

    await interaction.editReply({ embeds: [answer] });
  }


}
