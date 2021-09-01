import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateInput from '../../Validation/validateInput';
import isNotDmChannel from '../../Validation/Validators/isNotDmChannel';

export default class LeaveCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'leave',
      description: 'Leave the audio channel',
      options: [],
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

    await MusicPlayerRepository.destroy(interaction.guild.id);

    const answer = embedFactory();
    answer.setTitle('Left the channel');

    await interaction.reply({embeds: [answer]});
  }
}
