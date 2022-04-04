import { Response } from 'express';

export interface CookieOptions {
  'Max-Age'?: number,
  'Expires'?: string,
  'Path'?: string,
  'Domain'?: string,
  'Secure'?: boolean,
  'HttpOnly'?: boolean,
  'SameSite'?: string,
}

export default function setCookie(res: Response, name: string, value: string, options: CookieOptions = {}): void {
  if (typeof options['Max-Age'] === 'number') {
    options.Expires = new Date(Date.now() + options['Max-Age']).toString();
  }

  if (options.Path === undefined) {
    options.Path = '/';
  }

  const optionsString = Object.entries(options).reduce((acc, [key, value]) => {
    if (value === true) {
      return acc + ` ${key};`;
    }
    return acc + ` ${key}=${value};`;
  }, '');

  res.setHeader('Set-Cookie', `${name}=${encodeURIComponent(value)};${optionsString}`);
}
