export class MultiDownloader<T> {
  public static readonly parallelDownloadLimit = 50;

  private items: Promise<T>[] = [];

  public async download(item: Promise<T>): Promise<T[]> {
    this.items.push(item);

    if (this.items.length > MultiDownloader.parallelDownloadLimit) {
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
