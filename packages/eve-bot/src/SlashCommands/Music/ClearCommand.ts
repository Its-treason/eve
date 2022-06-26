import {ApplicationCommandData, CommandInteraction} from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from "./AbstractMusicCommand";
import {MusicPlayer} from "../../MusicPlayer/MusicPlayer";

@injectable()
export default class ClearCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    await player.clear();

    const answer = embedFactory(interaction.client, 'Cleared the queue!');

    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'clear',
      description: 'Clear the music queue',
    };
  }
}
