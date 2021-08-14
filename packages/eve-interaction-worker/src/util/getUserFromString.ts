import {User} from 'discord.js';
import getUserFromMention from './getUserFromMention';
import client from '../structures/client';

export default async (userString: string): Promise<(User|null)> => {
  try {
    let user = getUserFromMention(userString);

    if (user === null) {
      user = await client.users.fetch(`${BigInt(userString)}`);
    }

    return user || null;
  } catch (e) {
    return null;
  }
};
