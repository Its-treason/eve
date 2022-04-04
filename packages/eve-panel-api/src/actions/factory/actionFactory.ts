import AbstractAutoAction from '../AbstractAutoAction';
import AutoRolesAction from '../AutoRolesAction';
import LeaveMessageAction from '../LeaveMessageAction';
import JoinMessageAction from '../JoinMessageAction';

export default function actionFactory(action: string, payload: string): AbstractAutoAction|never {
  switch (action) {
    case 'auto-roles':
      return AutoRolesAction.fromPayload(payload);
    case 'join-message':
      return JoinMessageAction.fromPayload(payload);
    case 'leave-message':
      return LeaveMessageAction.fromPayload(payload);
  }

  throw new Error(`Undefined action "${action}"`);
}
