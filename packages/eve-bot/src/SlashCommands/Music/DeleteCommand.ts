import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class DeleteCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    const item = Number(interaction.options.get('item', true).value);

    await interaction.deferReply();

    const originalItem = player.getQueue()[(item - 1)];

    const success = await player.delete(item);

    if (success === true) {
      const answer = embedFactory(interaction.client, 'Deleted item!');
      answer.setDescription(
        `\`${originalItem.title}\` uploaded by \`${originalItem.uploader}\` is removed from the queue.`,
      );

      await interaction.editReply({ embeds: [answer] });
      return;
    }

    const answer = embedFactory(interaction.client, 'That song does not exists in the queue!');

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
