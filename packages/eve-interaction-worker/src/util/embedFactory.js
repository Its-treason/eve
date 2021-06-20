'use strict';

const discord = require('discord.js');

module.exports = (client) => {
  const answer = new discord.MessageEmbed();
  answer.setColor('#b4dbe0');
  answer.setTimestamp(new Date());
  answer.setFooter(`${client.user.username} - Util`, client.user.avatarURL());

  return answer;
};
