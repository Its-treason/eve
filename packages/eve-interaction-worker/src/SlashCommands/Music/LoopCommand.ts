import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateInput from '../../Validation/validateInput';
import isNotDmChannel from '../../Validation/Validators/isNotDmChannel';

export default class LoopCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'loop',
      description: 'loop the current playing song',
      options: [],
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

    const loopState = player.loopSong();

    const answer = embedFactory();
    answer.setTitle(loopState ? 'Now Looping!' : 'Stopped Loop!');

    await interaction.reply({embeds: [answer]});  
  }
}
