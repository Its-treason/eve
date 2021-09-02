import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class PauseCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'pause',
      description: 'pause or unpause the music player',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    const action = player.togglePause();

    const answer = embedFactory();
    answer.setTitle(`${action} the player!`);

    await interaction.reply({embeds: [answer]});
  }
}
