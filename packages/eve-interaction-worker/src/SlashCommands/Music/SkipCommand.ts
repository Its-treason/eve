import { CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class SkipCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'skip',
      description: 'skip the current playing song',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    await player.skip();

    const answer = embedFactory(interaction.client, 'Skipped the tracked!');

    await interaction.reply({ embeds: [answer] });
  }
}
