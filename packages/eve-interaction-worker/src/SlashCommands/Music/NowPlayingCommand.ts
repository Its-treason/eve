import { CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class NowPlayingCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'np',
      description: 'Get the currently playing',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction, false);
    if (player === false) {
      return;
    }

    const item = await player.getCurrentPlaying();
    const pointer = player.getPointer();

    const answer = embedFactory(interaction.client, 'Currently playing track');
    answer.setDescription(`\`${item.title}\` uploaded by \`${item.uploader}\``);
    answer.addField('Link', item.url);
    answer.addField('Current position', `\`${pointer + 1}\``);
    answer.setImage(`https://img.youtube.com/vi/${item.ytId}/0.jpg`);

    await interaction.reply({ embeds: [answer] });
  }
}
