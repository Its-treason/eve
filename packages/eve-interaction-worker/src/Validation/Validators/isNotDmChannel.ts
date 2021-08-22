import {ValidatorWrapper} from '../../types';
import {User} from 'discord.js';

const validator: ValidatorWrapper = function validator(msg: string) {
  return async (guild) => {
    if (guild === null) {
      return {valid: false, msg};
    }

    return {valid: true};
  };
};

export default validator;
