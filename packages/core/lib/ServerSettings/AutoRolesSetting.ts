import { z } from 'zod';
import AbstractServerSetting from './AbstractServerSetting';

const scheme = z.object({
  roles: z.array(z.string()),
  enabled: z.boolean(),
});

export default class AutoRolesSetting extends AbstractServerSetting<z.infer<typeof scheme>> {
  public static createEmpty(): AutoRolesSetting {
    return new AutoRolesSetting({ roles: [], enabled: false });
  }

  public static fromPayload(payload: Record<string, unknown>): AutoRolesSetting {
    return new AutoRolesSetting(scheme.parse(payload));
  }

  public getSettingName(): string {
    return 'auto-roles';
  }
}
