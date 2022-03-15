import AbstractAutoAction from './AbstractAutoAction';
import InvalidActionPayloadError from './error/InvalidActionPayloadError';

export default class LeaveMessageAction implements AbstractAutoAction {
  // eslint-disable-next-line no-useless-constructor
  private constructor(
    private enabled: boolean,
    private message: string,
    private channel: string,
  ) {}

  public static createEmpty(): LeaveMessageAction {
    return new LeaveMessageAction(false, '', '');
  }

  public static fromPayload(payload: string): LeaveMessageAction {
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (e) {
      throw new InvalidActionPayloadError('Error parsing payload');
    }

    if (typeof parsedPayload.enabled !== 'boolean') {
      throw new InvalidActionPayloadError(`Typeof "enabled" is wrong expected "boolean" got "${typeof parsedPayload.enabled}"`);
    }
    if (typeof parsedPayload.message !== 'string') {
      throw new InvalidActionPayloadError(`Typeof "message" is wrong expected "string" got "${typeof parsedPayload.message}"`);
    }
    if (typeof parsedPayload.channel !== 'string') {
      throw new InvalidActionPayloadError(`Typeof "channel" is wrong expected "string" got "${typeof parsedPayload.channel}"`);
    }

    return new LeaveMessageAction(parsedPayload.enabled, parsedPayload.message, parsedPayload.channel);
  }

  public getPayload(): string {
    return JSON.stringify({
      enabled: this.enabled,
      message: this.message,
      channel: this.channel,
    });
  }

  public getName(): string {
    return 'leave-message';
  }

  public getChannel(): string {
    return this.channel;
  }

  public getMessage(): string {
    return this.message;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}
