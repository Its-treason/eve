import { CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import { QueryResult } from '../../types';
import YtResultService from '../../MusicPlayer/YtResultService';
import Logger from '../../Util/Logger';

export default class PlayCommand extends AbstractSlashCommand {
  private ytResultService: YtResultService;
  private logger: Logger;

  constructor(
    ytResultService: YtResultService,
    logger: Logger,
  ) {
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
    this.logger = logger;
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

    let result: QueryResult;
    try {
      result = await this.ytResultService.parseQuery(query, interaction.user.id);
    } catch (error) {
      this.logger.warning('Error while getting YT-Result', { error });
      
      const answer = embedFactory(interaction.client, 'Error!');
      answer.setDescription('There was an error getting the YouTube result. Is the link correct?');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    await player.addToQueue(result.firstResult);

    const answer = embedFactory(interaction.client, 'Added to Queue!');
    await interaction.editReply({ embeds: [answer] });

    const fullResult = await result.getAll();
    for (const parsedUrl of fullResult) {
      await player.addToQueue(parsedUrl);
    }
  }
}
