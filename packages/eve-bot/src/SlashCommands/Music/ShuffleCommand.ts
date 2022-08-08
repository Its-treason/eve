import { ApplicationCommandData, ApplicationCommandType, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class ShuffleCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    await interaction.deferReply();

    await player.shuffle();

    const answer = embedFactory(interaction.client, 'Shuffled the queue!');

    await interaction.editReply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'shuffle',
      description: 'shuffle the queue',
      type: ApplicationCommandType.ChatInput,
      options: [],
    };
  }
}
