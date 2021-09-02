import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class ClearCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'clear',
      description: 'Clear the music queue',
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    await player.clear();

    const answer = embedFactory();
    answer.setTitle('Cleared');
    answer.setDescription('Cleared the queue!');

    await interaction.reply({embeds: [answer]});
  }
}
