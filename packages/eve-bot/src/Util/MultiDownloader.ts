export class MultiDownloader<T> {
  private items: Promise<T>[] = [];

  constructor(
    private readonly parallelDownloadLimit: number = 10,
  ) {}

  public async download(item: Promise<T>): Promise<T[]> {
    this.items.push(item);

    if (this.items.length > this.parallelDownloadLimit) {
      return this.flush();
    }
    return [];
  }

  public async flush(): Promise<T[]> {
    const awaitedItems = Promise.all(this.items);

    this.items = [];

    return awaitedItems;
  }
}
