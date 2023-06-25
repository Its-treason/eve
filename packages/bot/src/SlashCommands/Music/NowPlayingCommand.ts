import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class NowPlayingCommand extends AbstractMusicCommand {
  protected sameVc = false;

  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    const item = player.getCurrentPlaying();
    const pointer = player.getPointer();

    const answer = embedFactory(interaction.client, 'Currently playing track');
    answer.setDescription(`\`${item.title}\` uploaded by \`${item.uploader}\``);
    answer.addFields([
      { name: 'Current position', value: item.url },
      { name: 'Link', value: `\`${pointer + 1}\`` },
    ]);
    answer.setImage(`https://img.youtube.com/vi/${item.ytId}/mqdefault.jpg`);

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
