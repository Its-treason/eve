import { Validator } from '../types';
import { CommandInteraction, Guild, Message } from 'discord.js';
import embedFactory from '../Factory/messageEmbedFactory';

export default async function validateInput(
  guild: Guild,
  original: CommandInteraction|Message,
  ...validators: Validator[]
): Promise<boolean> {
  for (const validator of validators) {
    const result = await validator(guild);

    if (result.valid === false) {
      const answer = embedFactory(original.client, 'Error');
      answer.setDescription(result.msg || 'Unknown Error');
      await original.reply({ embeds: [answer], allowedMentions: { repliedUser: true }, ephemeral: true });
      return false;
    }
  }

  return true;
}
