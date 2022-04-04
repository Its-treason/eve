import AbstractAutoAction from '../AbstractAutoAction';
import AutoRolesAction from '../AutoRolesAction';
import LeaveMessageAction from '../LeaveMessageAction';
import JoinMessageAction from '../JoinMessageAction';

export default function emptyActionFactory(action: string): AbstractAutoAction|never {
  switch (action) {
    case 'auto-roles':
      return AutoRolesAction.createEmpty();
    case 'join-message':
      return JoinMessageAction.createEmpty();
    case 'leave-message':
      return LeaveMessageAction.createEmpty();
  }

  throw new Error(`Undefined action "${action}"`);
}
