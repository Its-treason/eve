import {ValidatorWrapper} from '../../types';
import {PermissionString, User} from 'discord.js';

const validator: ValidatorWrapper = function validator(user: User, permission: PermissionString, msg: string) {
  return async (guild) => {
    const member = await guild.members.fetch(user);

    if (!member.permissions.has(permission)) {
      return {valid: false, msg};
    }

    return {valid: true};
  };
};

export default validator;
