import getConfig from 'next/config';

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

type ApiResponse<T> = {
  code: number,
  data: T,
  error: null,
} | {
  code: number,
  data: null,
  error: string,
}

const hostPublic = publicRuntimeConfig.publicApiHost;
const hostInternal = publicRuntimeConfig.internalApiHost;

// if window is undefined we are in server
const host = typeof window === 'undefined' ? hostInternal : hostPublic;

export default class Ajax {
  public static async get<T = unknown>(
    url: string,
    params: Record<string, string> = {},
    apiKey?: string,
    abortController?: AbortController,
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: 'GET',
    };

    const paramsString = new URLSearchParams(params).toString();
    if (abortController) {
      options.signal = abortController.signal;
    }
    if (typeof apiKey === 'string') {
      options.headers = { apiKey };
    }

    try {
      const requestUrl = host + url + (paramsString !== '' ? `?${paramsString}` : '');
      const response = await fetch(requestUrl, options);
      const data = await response.json();

      if (response.status !== 200 || !data.success) {
        return {
          code: response.status,
          data: null,
          error: data.error,
        };
      }

      return {
        code: response.status,
        data: data.data,
        error: null,
      };
    } catch (error) {
      console.error('Ajax-Get Error:', error);

      if (error instanceof Error) {
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

  public static async post<T = unknown>(
    url: string,
    body: BodyInit,
    apiKey?: string,
    abortController?: AbortController,
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (abortController) {
      options.signal = abortController.signal;
    }
    if (typeof apiKey === 'string') {
      options.headers = {
        'Content-Type': 'application/json',
        apiKey,
      };
    }

    try {
      const response = await fetch(host + url, options);
      const data = await response.json();

      if (response.status !== 200 || !data.success) {
        return {
          code: response.status,
          data: null,
          error: data.error,
        };
      }

      return {
        code: response.status,
        data: data.data,
        error: null,
      };
    } catch (error) {
      console.error('Ajax-Post Error:', error);

      if (error instanceof Error) {
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
}
