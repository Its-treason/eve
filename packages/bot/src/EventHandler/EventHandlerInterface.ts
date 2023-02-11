export default interface EventHandlerInterface {
  getNameEventName(): string;

  execute(...payload: unknown[]): Promise<void>;
// eslint-disable-next-line semi
}
