import { ApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import MusicResultService from '../../MusicPlayer/MusicResultService';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';
import { Logger } from '@eve/core';

@injectable()
export default class PlayCommand extends AbstractMusicCommand {
  constructor(
    private ytResultService: MusicResultService,
    private logger: Logger,
  ) {
    super();
  }

  playerExists = false;

  async doExecute(interaction: ChatInputCommandInteraction<'cached'>, existingPlayer: MusicPlayer | null): Promise<void> {
    const member = await interaction.guild.members.fetch(interaction.user);
    if (member.voice.channel === null || !interaction.channel) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('You must be in a voice channel');
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return;
    }

    const query = String(interaction.options.get('query', true).value);

    let player: MusicPlayer | null = existingPlayer;
    if (!player) {
      player = MusicPlayerRepository.create(member.voice.channel, interaction.channel);
    }

    await interaction.deferReply();

    let result;
    try {
      result = await this.ytResultService.parseQuery(query, interaction.user.id);
    } catch (error) {
      this.logger.warning('Error while parsing query', { error });

      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription('There was an error getting a result.');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    console.log(result);
    

    if (result === false) {
      const answer = embedFactory(interaction.client, 'Error!');
      answer.setDescription('No results for your query found!');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    const firstResult = result[0];
    result.shift();
    await player.addToQueue(firstResult);

    let hasMoreText = '';
    if (result.length > 0) {
      hasMoreText = `and **${result.length}** more songs were`;
      if (result.length === 1) {
        hasMoreText = 'and **one** more song were';
      }
    }

    const answer = embedFactory(interaction.client, 'Added to Queue!');
    answer.setDescription(
      `\`${firstResult.title}\` uploaded by \`${firstResult.uploader}\` ${hasMoreText} added to queue.`,
    );
    answer.addFields([{ name: 'Link', value: firstResult.url }]);
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
