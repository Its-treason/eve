interface ApiResponse {
  code: number,
  data: Record<string, never>,
  error: string|null,
}

// @ts-ignore - See https://vitejs.dev/guide/env-and-mode.html
const host = import.meta.env.VITE_API_HOST;

export default class Ajax {
  public static async get(url: string, abortController?: AbortController): Promise<ApiResponse> {
    const options: RequestInit = {
      method: 'GET',
    };

    if (abortController) {
      options.signal = abortController.signal;
    }
    const apiKey = localStorage.getItem('apiKey');
    if (typeof apiKey === 'string') {
      options.headers = { apiKey };
    }

    try {
      const response = await fetch(host + url, options);
      
      return {
        code: response.status,
        data: (await response.json()),
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

  public static async post(url: string, body: BodyInit, abortController?: AbortController): Promise<ApiResponse> {
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
    const apiKey = localStorage.getItem('apiKey');
    if (typeof apiKey === 'string') {
      options.headers = {
        'Content-Type': 'application/json',
        apiKey,
      };
    }

    try {
      const response = await fetch(host + url, options);

      if (response.status !== 200) {
        const data = (await response.json());
        return {
          code: response.status,
          data,
          error: data.error,
        };
      }

      return {
        code: response.status,
        data: (await response.json()),
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
