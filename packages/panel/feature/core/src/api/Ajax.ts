import ApiKey from '../util/ApiKey';

type ApiResponse<T> = {
  code: number,
  data: T,
  error: null,
} | {
  code: number,
  data: null,
  error: string,
} | {
  code: 0,
  data: null,
  error: 'Aborted',
}

type FetchOptions = Partial<{
  apiKey?: string | false,
  cache: 'force-cache' | 'no-store',
  next: {
    revalidate: false | 0 | number,
  },
}> & RequestInit;

// When on the Server the can use the API_URL -> The Container name
const hostPublic = process.env.NEXT_PUBLIC_API_HOST;
const hostInternal = process.env.INTERNAL_API_HOST;

// If window is undefined we are in server
const host = typeof window === 'undefined' ? hostInternal : hostPublic;

export default class Ajax {
  private static async doRequest<T>(requestUrl: string, options: FetchOptions): Promise<ApiResponse<T>> {
    const existingHeaders = options.headers || {};

    const cookieApiKey = ApiKey.getApiKey();
    if (options.apiKey === undefined && cookieApiKey) {
        options.headers = {
          ...existingHeaders,
          apiKey: cookieApiKey,
        };
    } else if (typeof options.apiKey === 'string') {
        options.headers = {
          ...existingHeaders,
          apiKey: options.apiKey,
        };
    }

    try {
      const response = await fetch(requestUrl, options);
      const responseJson = await response.json();

      if (response.status !== 200 || !responseJson.success) {
        return {
          code: response.status,
          data: null,
          error: responseJson.error,
        };
      }

      return {
        code: response.status,
        data: responseJson.data,
        error: null,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.info(`Ajax aborted: ${requestUrl}`);
          return { code: 0, data: null, error: 'Aborted' } as const;
        }

        console.error(`Ajax Error: ${requestUrl}`, error);
        return {
          code: -1,
          data: null,
          error: error.message,
        };
      }

      return {
        code: -1,
        data: null,
        error: 'Unknown error',
      };
    }
  }

  public static async get<T = unknown>(
    url: string,
    params: Record<string, string> = {},
    options: FetchOptions = {},
  ): Promise<ApiResponse<T>> {
    options.method = 'GET';

    const paramsString = new URLSearchParams(params).toString();

    const requestUrl = host + url + (paramsString !== '' ? `?${paramsString}` : '');
    return Ajax.doRequest(requestUrl, options);
  }

  public static async put<T = unknown>(
    url: string,
    body: BodyInit,
    options: FetchOptions = {},
  ): Promise<ApiResponse<T>> {
    options.method = 'PUT';
    return this.doBodyRequest(url, body, options);
  }

  public static async post<T = unknown>(
    url: string,
    body: BodyInit,
    options: FetchOptions = {},
  ): Promise<ApiResponse<T>> {
    options.method = 'POST';
    return this.doBodyRequest(url, body, options);
  }

  private static async doBodyRequest<T = unknown>(
    url: string,
    body: BodyInit,
    options: FetchOptions,
  ): Promise<ApiResponse<T>> {
    options.body = body;
    options.headers = {
      'Content-Type': 'application/json',
    };

    const requestUrl = host + url;
    return Ajax.doRequest(requestUrl, options);
  }
}
