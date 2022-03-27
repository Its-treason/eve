import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';
import { injectable } from 'tsyringe';

@injectable()
export default class LoopCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    const loopState = player.loopSong();
    const nowPlaying = player.getCurrentPlaying();

    const answer = embedFactory(interaction.client, loopState ? 'Now Looping!' : 'Stopped Loop!');
    answer.setDescription(`Currently playing \`${nowPlaying.title}\` uploaded by \`${nowPlaying.uploader}\``);
    answer.addField('Link', nowPlaying.url);
    answer.setImage(`https://img.youtube.com/vi/${nowPlaying.ytId}/0.jpg`);

    await interaction.reply({ embeds: [answer] });  
  }

  getData(): ApplicationCommandData {
    return {
      name: 'loop',
        description: 'loop the current playing song',
      options: [],
    };
  }
}
