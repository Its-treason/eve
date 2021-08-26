import discord, {MessageEmbed} from 'discord.js';
import client from '../structures/client';

export default (): MessageEmbed => {
  const answer = new discord.MessageEmbed();
  answer.setColor('#b4dbe0');
  answer.setTimestamp(new Date());
  answer.setFooter(`${client.user?.username}`, client.user?.avatarURL());

  return answer;
};
