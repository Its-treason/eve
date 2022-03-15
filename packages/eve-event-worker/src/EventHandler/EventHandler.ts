export default interface EventHandler {
  getNameEventName(): string;

  execute(...payload: unknown[]): Promise<void>;
}
