import {ValidatorWrapper} from '../../types';
import {User} from 'discord.js';

const validator: ValidatorWrapper = function validator(user: User, msg: string) {
  return async (guild) => {
    if (guild.ownerId === user.id) {
      return {valid: false, msg};
    }

    return {valid: true};
  };
};

export default validator;
