import Url from 'url-parse';

const ytRegex = /(.*\.|^)youtube.com/g;

/**
 * @immutable
 */
export default class PlayQuery {
  private query: string;
  private type: string;

  private constructor(query: string) {
    const url = Url(query, true);

    if (
      (url.pathname === '/watch' || url.pathname === '/playlist') &&
      ytRegex.test(url.host) &&
      url.query.list !== undefined
    ) {
      this.type = 'yt-playlist';
      this.query = url.query.list;
      return;
    }

    if (
      url.pathname === '/watch' &&
      ytRegex.test(url.host) &&
      url.query.v !== undefined
    ) {
      this.type = 'search-id';
      this.query = url.query.v;
      return;
    }

    if (
      url.host === 'open.spotify.com' &&
      url.pathname.split('/')[1] === 'playlist' &&
      url.pathname.split('/')[2] !== undefined
    ) {
      this.type = 'spotify-playlist';
      this.query = url.pathname.split('/')[2];
      return;
    }

    this.type = 'search';
    this.query = query;
  }

  public getType(): string {
    return this.type;
  }

  public getQuery(): string {
    return this.query;
  }

  public static fromQuery(query: string): PlayQuery {
    return new PlayQuery(query);
  }
}
