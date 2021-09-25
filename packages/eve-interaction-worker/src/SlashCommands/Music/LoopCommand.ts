import { CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class LoopCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'loop',
      description: 'loop the current playing song',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    const loopState = player.loopSong();

    const answer = embedFactory(interaction.client, loopState ? 'Now Looping!' : 'Stopped Loop!');

    await interaction.reply({ embeds: [answer] });  
  }
}
