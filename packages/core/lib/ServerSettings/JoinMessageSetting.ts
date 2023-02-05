import { z } from 'zod';
import AbstractServerSetting from './AbstractServerSetting';
import InvalidActionPayloadError from './Error/InvalidServerSettingPayloadError';

const scheme = z.object({
  message: z.string(),
  channel: z.string(),
  enabled: z.boolean(),
})

export default class JoinMessageAction extends AbstractServerSetting<z.infer<typeof scheme>> {
  public static createEmpty(): JoinMessageAction {
    return new JoinMessageAction({ channel: '', message: '', enabled: false });
  }

  public static fromPayload(payload: Record<string, unknown>): JoinMessageAction {
    return new JoinMessageAction(scheme.parse(payload));
  }

  public getSettingName(): string {
    return 'join-message';
  }
}
