import { z } from 'zod';
import AbstractServerSetting from './AbstractServerSetting';

const scheme = z.object({
  message: z.string(),
  channel: z.string(),
  enabled: z.boolean(),
});

export default class LeaveMessageAction extends AbstractServerSetting<z.infer<typeof scheme>> {
  public static createEmpty(): LeaveMessageAction {
    return new LeaveMessageAction({ channel: '', message: '', enabled: false });
  }

  public static fromPayload(payload: Record<string, unknown>): LeaveMessageAction {
    return new LeaveMessageAction(scheme.parse(payload));
  }

  public getSettingName(): string {
    return 'leave-message';
  }
}
