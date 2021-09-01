import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../AbstractSlashCommand';
import MusicPlayerRepository from '../../MusicPlayer/MusicPlayerRepository';
import embedFactory from '../../Factory/messageEmbedFactory';

export default class NowPlayingCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'np',
      description: 'Get the currently playing',
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

    if (!MusicPlayerRepository.has(interaction.guild.id)) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('Iam currently not playing any music');
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true}, ephemeral: true});
      return;
    }

    const player = MusicPlayerRepository.get(interaction.guild?.id || '');

    const item = await player.getCurrentPlaying();

    const answer = embedFactory();
    answer.setTitle('Currently playing track');
    answer.setDescription(`${item.title} uploaded by ${item.uploader}`);
    answer.addField('Link', item.url);
    answer.setImage(`https://img.youtube.com/vi/${item.ytId}/0.jpg`);

    await interaction.reply({embeds: [answer]});
  }
}
