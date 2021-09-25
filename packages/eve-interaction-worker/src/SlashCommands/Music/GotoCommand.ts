import { CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class GotoCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'goto',
      description: 'Goto a position in the queue',
      options: [
        {
          name: 'position',
          description: 'The position to goto',
          type: 4,
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    await interaction.deferReply();

    const position = interaction.options.getInteger('position', true);

    const success = await player.goto(position);

    if (success === true) {
      const answer = embedFactory(interaction.client, `Changed position to ${position}!`);
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    const answer = embedFactory(interaction.client, 'That item does not exists!');
    await interaction.editReply({ embeds: [answer] });
  }
}
