import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import { QueryResult } from '../../types';
import YtResultService from '../../MusicPlayer/YtResultService';
import Logger from '../../Structures/Logger';
import { injectable } from 'tsyringe';

@injectable()
export default class PlayCommand implements SlashCommandInterface {
  constructor(
    private ytResultService: YtResultService,
    private logger: Logger,
  ) {}

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
      answer.setDescription('There was an error getting a result. Is the link correct?');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    await player.addToQueue(result.firstResult);

    const answer = embedFactory(interaction.client, 'Added to Queue!');
    answer.setDescription(
      `\`${result.firstResult.title}\` uploaded by \`${result.firstResult.uploader}\` added to queue`,
    );
    answer.addField('Link', result.firstResult.url);
    answer.setImage(`https://img.youtube.com/vi/${result.firstResult.ytId}/0.jpg`);
    await interaction.editReply({ embeds: [answer] });

    const fullResult = await result.getAll();
    for (const parsedUrl of fullResult) {
      await player.addToQueue(parsedUrl);
    }
  }

  getData(): ApplicationCommandData {
    return {
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
    };
  }
}
