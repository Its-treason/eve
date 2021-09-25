import { ValidatorWrapper } from '../../types';

const validator: ValidatorWrapper = function validator(value1: string, value2: string, msg: string) {
  return async () => {
    if (value1 !== value2) {
      return { valid: false, msg };
    }

    return { valid: true };
  };
};

export default validator;
