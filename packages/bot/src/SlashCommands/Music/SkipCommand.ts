import { ApplicationCommandData, ApplicationCommandType, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class SkipCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    const skipped = player.getCurrentPlaying();
    if (!skipped) {
      const answer = embedFactory(interaction.client, 'Nothing to skip!');
      await interaction.reply({ embeds: [answer] });
      return;
    }

    await player.skip();
    const nowPlaying = player.getCurrentPlaying();

    const answer = embedFactory(interaction.client, 'Skipped the tracked!');
    answer.setDescription('Reached end of the queue!');
    if (nowPlaying !== skipped) {
      answer.setDescription(`Now playing \`${nowPlaying.title}\` uploaded by \`${nowPlaying.uploader}\``);
      answer.addFields([
        { name: 'Link', value: nowPlaying.url },
        { name: 'Skipped', value: `\`${skipped.title}\` uploaded by \`${skipped.uploader}\` was skipped!` },
      ]);
      answer.setImage(`https://img.youtube.com/vi/${nowPlaying.ytId}/mqdefault.jpg`);
    }

    await interaction.reply({ embeds: [answer] });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'skip',
      description: 'skip the current playing song',
      type: ApplicationCommandType.ChatInput,
      options: [],
    };
  }
}
