import discord, { Client, MessageEmbed } from 'discord.js';

export default function MessageEmbedFactory(client: Client, title: string): MessageEmbed {
  const answer = new discord.MessageEmbed();
  answer.setColor('#b4dbe0');
  answer.setTimestamp(new Date());
  answer.setFooter({text: `${client.user?.username}`, iconURL: client.user?.avatarURL() || undefined});
  answer.setTitle(title);

  return answer;
}
