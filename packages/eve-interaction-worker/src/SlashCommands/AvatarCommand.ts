import { CommandInteraction } from 'discord.js';
import embedFactory from '../Factory/messageEmbedFactory';
import AbstractSlashCommand from './AbstractSlashCommand';

export default class AvatarCommand extends AbstractSlashCommand {
  constructor() {
    super({
      name: 'avatar',
      description: 'Get a users Avatar',
      options: [
        {
          name: 'user',
          description: 'User to get the avatar of',
          type: 6,
        },
        {
          name: 'size',
          description: 'Size of the image. Default: 128',
          type: 4,
          choices: [
            {
              name: '64',
              value: 64,
            },
            {
              name: '128',
              value: 128,
            },
            {
              name: '512',
              value: 512,
            },
            {
              name: '2048',
              value: 2048,
            },
            {
              name: '4096',
              value: 4096,
            },
          ],
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user', false) || interaction.user;
    const size = interaction.options.getInteger('size', false) || 128;

    if (size !== 64 && size !== 128 && size !== 512 && size !== 2048 && size !== 4096) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription(`\`${size}\` is not a valid size!`);
      await interaction.reply({ embeds: [answer] });
      return;
    }

    const link = user.displayAvatarURL({ format: 'png', size: size });

    const answer = embedFactory(interaction.client, `Avatar of ${user.username}`);
    answer.addField('Link', link);
    answer.setImage(link);
    await interaction.reply({ embeds: [answer] });
  }
}
