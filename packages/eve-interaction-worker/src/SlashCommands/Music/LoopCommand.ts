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

    const answer = embedFactory(interaction.client, loopState ? 'Now Looping!' : 'Stopped Loop!');

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
