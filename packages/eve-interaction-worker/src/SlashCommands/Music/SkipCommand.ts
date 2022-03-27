import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';
import { injectable } from 'tsyringe';

@injectable()
export default class SkipCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    const skipped = player.getCurrentPlaying();
    if (!skipped) {
      const answer = embedFactory(interaction.client, 'Nothing to skip!');
      await interaction.reply({ embeds: [answer] });
      return;
    }

    await player.skip();
    const nowPlaying = player.getCurrentPlaying();

    const answer = embedFactory(interaction.client, 'Skipped the tracked!');
    answer.setDescription('Reached end of the queue!');
    if (nowPlaying !== skipped) {
      answer.setDescription(`Now playing \`${nowPlaying.title}\` uploaded by \`${nowPlaying.uploader}\``);
      answer.addField('Link', nowPlaying.url);
      answer.addField('Skipped', `${skipped.title}\` uploaded by \`${skipped.uploader}\` was skipped!`);
      answer.setImage(`https://img.youtube.com/vi/${nowPlaying.ytId}/0.jpg`);
    }

    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'skip',
      description: 'skip the current playing song',
      options: [],
    };
  }
}
