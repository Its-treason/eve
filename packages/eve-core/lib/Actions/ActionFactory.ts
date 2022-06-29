import LeaveMessageAction from './LeaveMessageAction';
import AutoActionInterface from './AutoActionInterface';
import AutoRolesAction from './AutoRolesAction';
import JoinMessageAction from './JoinMessageAction';

export default class ActionFactory {
  createAction(action: string, payload: string): AutoActionInterface|never {
    switch (action) {
      case 'auto-roles':
        return AutoRolesAction.fromPayload(payload);
      case 'join-message':
        return JoinMessageAction.fromPayload(payload);
      case 'leave-message':
        return LeaveMessageAction.fromPayload(payload);
    }
  
    throw new Error(`Cannot create action with name "${action}". Unkown Action.`);
  }
}
