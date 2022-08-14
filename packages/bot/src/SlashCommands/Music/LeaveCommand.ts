import { ApplicationCommandData, ApplicationCommandType, CommandInteraction } from 'discord.js';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class LeaveCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    await MusicPlayerRepository.destroy(interaction.guild.id);

    const answer = embedFactory(interaction.client, 'Left the channel');

    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'leave',
      description: 'Leave the audio channel',
      type: ApplicationCommandType.ChatInput,
      options: [],
    };
  }
}
