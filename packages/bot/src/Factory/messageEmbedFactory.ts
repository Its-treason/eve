import { Client, EmbedBuilder } from 'discord.js';

export default function messageEmbedFactory(client: Client, title: string): EmbedBuilder {
  const answer = new EmbedBuilder();
  answer.setColor('#b4dbe0');
  answer.setTimestamp(new Date());
  answer.setFooter({ text: `${client.user?.username}`, iconURL: client.user?.displayAvatarURL() });
  answer.setTitle(title);

  return answer;
}
