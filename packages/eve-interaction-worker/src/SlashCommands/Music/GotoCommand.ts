import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../SlashCommandInterface';
import embedFactory from '../../Factory/messageEmbedFactory';
import validateCanGetPlayer from '../../Validation/validateCanGetPlayer';
import { injectable } from 'tsyringe';

@injectable()
export default class GotoCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const player = await validateCanGetPlayer(interaction);
    if (player === false) {
      return;
    }

    await interaction.deferReply();

    const position = interaction.options.getInteger('position', true);

    const success = await player.goto(position);
    const nowPlaying = player.getCurrentPlaying();

    if (success === true) {
      const answer = embedFactory(interaction.client, `Changed position to ${position}!`);
      answer.setDescription(`Now playing \`${nowPlaying.title}\` uploaded by \`${nowPlaying.uploader}\``);
      answer.addField('Link', nowPlaying.url);
      answer.setImage(`https://img.youtube.com/vi/${nowPlaying.ytId}/0.jpg`);
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
      options: [
        {
          name: 'position',
          description: 'The position to goto',
          type: 4,
          required: true,
        },
      ],
    };
  }
}
