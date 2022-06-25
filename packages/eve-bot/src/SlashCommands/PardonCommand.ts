import embedFactory from '../Factory/messageEmbedFactory';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import validateInput from '../Validation/validateInput';
import isNotDmChannel from '../Validation/Validators/isNotDmChannel';
import hasPermissions from '../Validation/Validators/hasPermissions';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';

@injectable()
export default class PardonCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const actionUser = interaction.user;
    const targetUser = interaction.options.get('user').user;

    const inputValidationResult = await validateInput(
      interaction.guild,
      interaction,
      isNotDmChannel('This command cannot be used in a DMs!'),
      hasPermissions(actionUser, 'BAN_MEMBERS', 'You dont have the permission to ban/unban member!'),
    );
    if (inputValidationResult === false) {
      return;
    }

    let banInfo;
    try {
      banInfo = await interaction.guild.bans.fetch({ user: targetUser, force: true });
    } catch (e) {
      if (e.message !== 'Unknown Ban') {
        throw e;
      }

      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription(`${targetUser} is currently not banned in this guild!`);
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true } });
      return;
    }

    await interaction.guild.bans.remove(targetUser);

    const answer = embedFactory(interaction.client, 'Pardoned');
    answer.setDescription(`${targetUser} was successfully pardoned!`);
    answer.addField('Original ban reason', banInfo.reason);
    await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true } });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'pardon',
      description: 'Revoke a users ban',
      options: [
        {
          name: 'user',
          description: 'User to unban',
          type: 6,
          required: true,
        },
      ],
    };
  }
}
