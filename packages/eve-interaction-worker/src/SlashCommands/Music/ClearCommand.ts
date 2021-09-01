import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import {APIApplicationCommandOption} from 'discord-api-types';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateInput from '../../Validation/validateInput';
import isNotDmChannel from '../../Validation/Validators/isNotDmChannel';
import notEquals from '../../Validation/Validators/notEquals';

export default class ClearCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'clear',
      description: 'Clear the music queue',
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    if (interaction.guild === null) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('Command can not be executed inside DMs!');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
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

    if (member.voice.channelId !== player.getVoiceChannelId()) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('You must be in the same voice channel as iam in');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
      return;
    }

    await player.clear();

    const answer = embedFactory();
    answer.setTitle('Cleared');
    answer.setDescription('Cleared the queue!');

    await interaction.reply({embeds: [answer]});
  }
}
