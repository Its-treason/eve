export default abstract class AbstractServerSetting<K = Record<never, never>> {
  constructor(
    protected payload: K,
  ) {}

  public getPayload(): K {
    return this.payload;
  }

  abstract getSettingName(): string;
}
