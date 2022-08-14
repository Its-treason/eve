import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { MusicResult } from '../../types';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class QueueCommand extends AbstractMusicCommand {
  sameVc = false;

  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    const items = player.getQueue();
    const pointer = player.getPointer();
    const startItemPointer = (Number(interaction.options.get('offset').value) || (pointer - 1)) - 1;

    if (items.length === 0) {
      const answer = embedFactory(interaction.client, 'Queue is empty');
      await interaction.reply({ embeds: [answer] });
      return;
    }

    const queue = this.createQueueMessage(items, startItemPointer, pointer);

    await interaction.reply({ content: queue });
  }

  createQueueMessage(items: MusicResult[], startItemPointer: number, pointer: number): string {
    let queue = '```nim\n';

    if (startItemPointer < 0) {
      startItemPointer = 0;
    }

    for (let i = startItemPointer; i < items.length; i++) {
      let itemString = `${i + 1}> ${items[i].title} uploaded by ${items[i].uploader}\n`;

      if (i === pointer) {
        const intend = ' '.repeat(`${pointer}`.length + 2);

        itemString = `${intend}⬐ current track\n${itemString}${intend}⬑ current track\n`;
      }

      if ((queue + itemString).length > 1950) {
        break;
      }
      queue += itemString;
    }

    return queue + '\n```';
  }

  getData(): ApplicationCommandData {
    return {
      name: 'queue',
      description: 'Get current queue',
      options: [
        {
          name: 'offset',
          description: 'Position from where to show the queue',
          type: 4,
        },
      ],
    };
  }
}
