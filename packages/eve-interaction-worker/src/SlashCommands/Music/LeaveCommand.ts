import { CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class LeaveCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'leave',
      description: 'Leave the audio channel',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    await MusicPlayerRepository.destroy(interaction.guild.id);

    const answer = embedFactory(interaction.client, 'Left the channel');

    await interaction.reply({ embeds: [answer] });
  }
}
