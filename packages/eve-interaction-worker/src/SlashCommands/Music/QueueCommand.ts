import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import {QueueItem} from '../../types';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class QueueCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'queue',
      description: 'Get current queue',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction, false);
    if (player === false) {
      return;
    }

    const items = player.getQueue();
    const pointer = player.getPointer();

    if (items.length === 0) {
      const answer = embedFactory();
      answer.setTitle('Queue is empty');
      await interaction.reply({embeds: [answer]});
      return;
    }

    const queue = this.createQueueMessage(items, pointer);

    await interaction.reply({content: queue});
  }

  createQueueMessage(items: QueueItem[], pointer: number): string {
    let queue = '```nim\n';

    let startItemPointer = pointer - 2;
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
}
