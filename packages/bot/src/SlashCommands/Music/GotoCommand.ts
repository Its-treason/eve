import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction } from 'discord.js';
import embedFactory from '../../Factory/messageEmbedFactory';
import { injectable } from 'tsyringe';
import AbstractMusicCommand from './AbstractMusicCommand';
import { MusicPlayer } from '../../MusicPlayer/MusicPlayer';

@injectable()
export default class GotoCommand extends AbstractMusicCommand {
  async doExecute(interaction: CommandInteraction, player: MusicPlayer): Promise<void> {
    await interaction.deferReply();

    const position = Number(interaction.options.get('position', true).value);

    const success = await player.goto(position);
    const nowPlaying = player.getCurrentPlaying();

    if (success === true) {
      const answer = embedFactory(interaction.client, `Changed position to ${position}!`);
      answer.setDescription(`Now playing \`${nowPlaying.title}\` uploaded by \`${nowPlaying.uploader}\``);
      answer.addFields([{ name: 'Link', value: nowPlaying.url }]);
      answer.setImage(`https://img.youtube.com/vi/${nowPlaying.ytId}/mqdefault.jpg`);
      await interaction.editReply({ embeds: [answer] });
      return;
    }

    const answer = embedFactory(interaction.client, 'That song does not exists in the queue!');
    await interaction.editReply({ embeds: [answer] });
  }

  public getData(): ApplicationCommandData {
    return {
      name: 'goto',
      description: 'Goto a position in the queue',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'position',
          description: 'The position to goto',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    };
  }
}
