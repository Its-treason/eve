import {User} from 'discord.js';
import client from '../structures/Client';

export default (mention: string): (null|User) => {
  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(`${BigInt(mention)}`) || null;
  }

  return null;
};
