import {ApplicationCommandData, CommandInteraction} from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from "./AbstractMusicCommand";
import {MusicPlayer} from "../../MusicPlayer/MusicPlayer";

@injectable()
export default class LoopCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
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
