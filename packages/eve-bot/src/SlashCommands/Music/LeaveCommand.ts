import {ApplicationCommandData, CommandInteraction} from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';
import {injectable} from 'tsyringe';

@injectable()
export default class LeaveCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    await MusicPlayerRepository.destroy(interaction.guild.id);

    const answer = embedFactory(interaction.client, 'Left the channel');

    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'leave',
      description: 'Leave the audio channel',
      options: [],
    };
  }
}
