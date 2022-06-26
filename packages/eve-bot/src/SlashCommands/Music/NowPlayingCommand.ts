import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from "./AbstractMusicCommand";
import {MusicPlayer} from "../../MusicPlayer/MusicPlayer";

@injectable()
export default class NowPlayingCommand extends AbstractMusicCommand {
  protected sameVc = false;

  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    const item = await player.getCurrentPlaying();
    const pointer = player.getPointer();

    const answer = embedFactory(interaction.client, 'Currently playing track');
    answer.setDescription(`\`${item.title}\` uploaded by \`${item.uploader}\``);
    answer.addField('Link', item.url);
    answer.addField('Current position', `\`${pointer + 1}\``);
    answer.setImage(`https://img.youtube.com/vi/${item.ytId}/0.jpg`);

    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'np',
      description: 'Get the currently playing',
      options: [],
    };
  }
}
