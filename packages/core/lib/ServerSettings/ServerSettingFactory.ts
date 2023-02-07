import LeaveMessageSetting from './LeaveMessageSetting';
import ServerSettingInterface from './AbstractServerSetting';
import AutoRolesSetting from './AutoRolesSetting';
import JoinMessageSetting from './JoinMessageSetting';
import PublicLogsSubscriptionSetting from './PublicLogsSubscriptionSetting';

export default class ActionFactory {
  createAction(action: string, payload: Record<string, unknown>): ServerSettingInterface|never {
    switch (action) {
      case 'auto-roles':
        return AutoRolesSetting.fromPayload(payload);
      case 'join-message':
        return JoinMessageSetting.fromPayload(payload);
      case 'leave-message':
        return LeaveMessageSetting.fromPayload(payload);
      case PublicLogsSubscriptionSetting.TOPIC:
        return PublicLogsSubscriptionSetting.fromPayload(payload);
    }

    throw new Error(`Cannot create action with name "${action}". Unknown Action.`);
  }

  createEmpty(action: string): ServerSettingInterface|never {
    switch (action) {
      case 'auto-roles':
        return AutoRolesSetting.createEmpty();
      case 'join-message':
        return JoinMessageSetting.createEmpty();
      case 'leave-message':
        return LeaveMessageSetting.createEmpty();
      case PublicLogsSubscriptionSetting.TOPIC:
        return PublicLogsSubscriptionSetting.createEmpty();
    }

    throw new Error(`Undefined action "${action}"`);
  }
}
