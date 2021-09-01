import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import {QueueItem} from '../../types';

export default class QueueCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'queue',
      description: 'Get current queue',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    if (MusicPlayerRepository.has(interaction.guild.id) === false) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('Iam currently not playing any music');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
      return;
    }

    const player = MusicPlayerRepository.get(interaction.guild.id);

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
