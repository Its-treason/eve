import { ApplicationCommandData, ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class MoveCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    const item = Number(interaction.options.get('item', true).value);
    const newPosition = Number(interaction.options.get('new_position', true).value);

    await interaction.deferReply();

    const success = await player.move(item, newPosition);

    if (!success) {
      const answer = embedFactory(interaction.client, 'That item does not exists!');
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    const answer = embedFactory(interaction.client, 'Moved item!');
    await interaction.editReply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'move',
      description: 'move a queue item to another position',
      options: [
        {
          name: 'item',
          description: 'the song to be moved',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: 'new_position',
          description: 'The new position. 0 or a negative number will put the item at the start.',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    };
  }
}
