import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';

export default class PauseCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'pause',
      description: 'pause or unpause the music player',
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

    const player = MusicPlayerRepository.get(interaction.guild.id);

    const member = await interaction.guild.members.fetch(interaction.user);

    if (member.voice.channelId !== player.getVoiceChannelId()) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('You must be in the same voice channel as iam in');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
      return;
    }

    const action = player.togglePause();

    const answer = embedFactory();
    answer.setTitle(`${action} the player!`);

    await interaction.reply({embeds: [answer]});
  }
}
