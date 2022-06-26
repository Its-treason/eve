import {ApplicationCommandData, CommandInteraction} from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from "./AbstractMusicCommand";
import {MusicPlayer} from "../../MusicPlayer/MusicPlayer";

@injectable()
export default class PauseCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    const action = player.togglePause();

    const answer = embedFactory(interaction.client, `${action} the player!`);

    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'pause',
      description: 'Pause or Unpause the music player',
      options: [],
    };
  }
}
