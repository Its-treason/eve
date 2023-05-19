import { z } from 'zod';
import { reducedEmbedScheme } from '../zodSchemes';
import AbstractServerSetting from './AbstractServerSetting';

const scheme = z.object({
  message: z.string(),
  channel: z.string(),
  enabled: z.boolean(),
  embed: reducedEmbedScheme.nullable(),
});

export default class JoinMessageAction extends AbstractServerSetting<z.infer<typeof scheme>> {
  public static createEmpty(): JoinMessageAction {
    return new JoinMessageAction({ channel: '', message: '', enabled: false, embed: null });
  }

  public static fromPayload(payload: Record<string, unknown>): JoinMessageAction {
    return new JoinMessageAction(scheme.parse(payload));
  }

  public getSettingName(): string {
    return 'join-message';
  }
}
