import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class DeleteCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'delete',
      description: 'Delete an item from the queue',
      options: [
        {
          name: 'item',
          description: 'the song to be deleted',
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

    const success = await player.delete(item);

    if (success) {
      const answer = embedFactory();
      answer.setTitle('Deleted item!');

      await interaction.reply({embeds: [answer]});
      return;
    }

    const answer = embedFactory();
    answer.setTitle('That item does not exists!');

    await interaction.reply({embeds: [answer]});
  }
}
