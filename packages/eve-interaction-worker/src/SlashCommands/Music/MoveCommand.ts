import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateInput from '../../Validation/validateInput';
import isNotDmChannel from '../../Validation/Validators/isNotDmChannel';

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
    const inputValidationResult = await validateInput(
      interaction.guild,
      interaction,
      isNotDmChannel('This command cannot be used in a DMs!'),
    );
    if (inputValidationResult === false) {
      return;
    }

    if (MusicPlayerRepository.has(interaction.guild.id) === false) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('Iam currently not playing any music');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
      return;
    }

    const player = MusicPlayerRepository.get(interaction.guild.id);

    const member = await interaction.guild.members.fetch(interaction.user);

    if (member.voice?.channelId !== player.getVoiceChannelId()) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('You must be in the same voice channel as iam in');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
      return;
    }

    const item = interaction.options.getInteger('item', true).valueOf();
    const newPosition = interaction.options.getInteger('new_position', true).valueOf();

    const success = player.move(item, newPosition);

    if (success) {
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
