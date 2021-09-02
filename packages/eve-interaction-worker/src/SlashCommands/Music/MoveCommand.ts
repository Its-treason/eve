import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class MoveCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'move',
      description: 'move a queue item to another position',
      options: [
        {
          name: 'item',
          description: 'the song to be moved',
          type: 4,
          required: true,
        },
        {
          name: 'new_position',
          description: 'The new position. 0 or a negative number will put the item at the start.',
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

    const item = interaction.options.getInteger('item', true).valueOf();
    const newPosition = interaction.options.getInteger('new_position', true).valueOf();

    const success = await player.move(item, newPosition);

    if (success === true) {
      const answer = embedFactory();
      answer.setTitle('Moved item!');

      await interaction.reply({embeds: [answer]});
      return;
    }

    const answer = embedFactory();
    answer.setTitle('That item does not exists!');

    await interaction.reply({embeds: [answer]});
  }
}
