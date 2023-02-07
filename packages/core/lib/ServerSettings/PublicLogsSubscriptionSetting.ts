import { z } from 'zod';
import AbstractServerSetting from './AbstractServerSetting';

const scheme = z.object({
  wantedCategories: z.array(z.string()),
  channel: z.string(),
  enabled: z.boolean(),
})

export default class PublicLogsSubscriptionSetting extends AbstractServerSetting<z.infer<typeof scheme>> {
  public static readonly TOPIC = 'public-logs-subscription';

  public static createEmpty(): PublicLogsSubscriptionSetting {
    return new PublicLogsSubscriptionSetting({ channel: '', wantedCategories: [], enabled: false });
  }

  public static fromPayload(payload: Record<string, unknown>): PublicLogsSubscriptionSetting {
    return new PublicLogsSubscriptionSetting(scheme.parse(payload));
  }

  public getSettingName(): string {
    return PublicLogsSubscriptionSetting.TOPIC;
  }
}
