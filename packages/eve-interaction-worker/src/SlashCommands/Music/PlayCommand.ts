import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import MusicResultService from '../../MusicPlayer/MusicResultService';
import Logger from '../../Structures/Logger';
import { injectable } from 'tsyringe';

@injectable()
export default class PlayCommand implements SlashCommandInterface {
  constructor(
    private ytResultService: MusicResultService,
    private logger: Logger,
  ) {}

  async execute(interaction: CommandInteraction): Promise<void> {
    if (interaction.channel.type === 'DM') {
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

    let result;
    try {
      result = await this.ytResultService.parseQuery(query, interaction.user.id);
    } catch (error) {
      this.logger.warning('Error while getting YT-Result', { error });

      const answer = embedFactory(interaction.client, 'Error!');
      answer.setDescription('There was an error getting a result.');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    if (result === false) {
      const answer = embedFactory(interaction.client, 'Error!');
      answer.setDescription('No results for your query found!');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    const firstResult = result.shift();
    await player.addToQueue(firstResult);

    let hasMoreText = '';
    if (result.length > 0) {
      hasMoreText = `and **${result.length}** more songs were`;
    }

    const answer = embedFactory(interaction.client, 'Added to Queue!');
    answer.setDescription(
      `\`${firstResult.title}\` uploaded by \`${firstResult.uploader}\` ${hasMoreText} added to queue.`,
    );
    answer.addField('Link', firstResult.url);
    answer.setImage(`https://img.youtube.com/vi/${firstResult.ytId}/0.jpg`);
    await interaction.editReply({ embeds: [answer] });

    for (const resultItem of result) {
      await player.addToQueue(resultItem);
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
