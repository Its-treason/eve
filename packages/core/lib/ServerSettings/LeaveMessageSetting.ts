import { z } from 'zod';
import { reducedEmbedScheme } from '../zodSchemes';
import AbstractServerSetting from './AbstractServerSetting';

const scheme = z.object({
  message: z.string(),
  channel: z.string(),
  enabled: z.boolean(),
  embed: reducedEmbedScheme.nullable(),
});

export default class LeaveMessageAction extends AbstractServerSetting<z.infer<typeof scheme>> {
  public static createEmpty(): LeaveMessageAction {
    return new LeaveMessageAction({ channel: '', message: '', enabled: false, embed: null });
  }

  public static fromPayload(payload: Record<string, unknown>): LeaveMessageAction {
    return new LeaveMessageAction(scheme.parse(payload));
  }

  public getSettingName(): string {
    return 'leave-message';
  }
}
