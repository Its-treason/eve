import * as CookiesNext from 'cookies-next';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export default class ApiKey {
  public static setApiKey(apiKey: string): void {
    if (typeof window === 'undefined') {
      throw new Error('Cannot modify ApiKey from Server');
    }
    CookiesNext.setCookie('apiKey', apiKey);
  }

  public static getApiKey(cookies?: ReadonlyRequestCookies): string | null {
    if (typeof window === 'undefined') {
      if (!cookies) {
        return null;
      }
      const cookie = cookies.get('apiKey');
      return cookie !== undefined ? cookie.value : null;
    }
    const cookie = CookiesNext.getCookie('apiKey');
    return cookie !== undefined ? String(cookie) : null;
  }

  public static deleteApiKey(): void {
    if (typeof window === 'undefined') {
      throw new Error('Cannot modify ApiKey from Server');
    }
    CookiesNext.deleteCookie('apiKey');
  }
}
