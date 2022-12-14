import AutoActionInterface from './AutoActionInterface';
import InvalidActionPayloadError from './Error/InvalidActionPayloadError';

export default class AutoRolesAction implements AutoActionInterface {
  private constructor(
    private roles: string[],
    private enabled: boolean,
  ) {}

  public static createEmpty(): AutoRolesAction {
    return new AutoRolesAction([], false);
  }

  public static fromPayload(payload: string): AutoRolesAction {
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (e) {
      throw new InvalidActionPayloadError('Error parsing payload');
    }

    if (!Array.isArray(parsedPayload.roles)) {
      throw new InvalidActionPayloadError(`Typeof "roles" is wrong expected "array" got "${typeof parsedPayload.enabled}"`);
    }
    if (typeof parsedPayload.enabled !== 'boolean') {
      throw new InvalidActionPayloadError(`Typeof "enabled" is wrong expected "boolean" got "${typeof parsedPayload.enabled}"`);
    }

    return new AutoRolesAction(parsedPayload.roles, parsedPayload.enabled);
  }

  public getPayload(): string {
    return JSON.stringify({
      roles: this.roles,
      enabled: this.enabled,
    });
  }

  public getName(): string {
    return 'auto-roles';
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getRoles(): string[] {
    return this.roles;
  }
}
