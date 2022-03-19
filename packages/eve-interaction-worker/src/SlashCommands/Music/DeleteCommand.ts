import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';
import { injectable } from 'tsyringe';

@injectable()
export default class DeleteCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    const item = interaction.options.getInteger('item', true).valueOf();

    await interaction.deferReply();

    const success = await player.delete(item);

    if (success === true) {
      const answer = embedFactory(interaction.client, 'Deleted item!');

      await interaction.editReply({ embeds: [answer] });
      return;
    }

    const answer = embedFactory(interaction.client, 'That item does not exists!');

    await interaction.editReply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
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
    };
  }
}
