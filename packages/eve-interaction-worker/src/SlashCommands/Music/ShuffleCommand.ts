import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';

export default class ShuffleCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'shuffle',
      description: 'shuffle the queue',
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user);

    if (member.voice?.channelId !== player.getVoiceChannelId()) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('You must be in the same voice channel as iam in');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
      return;
    }

    await player.shuffle();

    const answer = embedFactory();
    answer.setTitle('Shuffled the queue!');

    await interaction.reply({embeds: [answer]});  
  }
}
