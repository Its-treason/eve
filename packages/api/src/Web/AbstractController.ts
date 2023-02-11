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

export default abstract class AbstractController {
  protected userErrorResponse(
    res: Response,
    msg: string,
    errorDetails: unknown = null,
    data: unknown = null,
  ): void {
    res.status(400);
    res.json({
      success: false,
      data,
      errorDetails,
      error: msg,
    });
  }

  protected userUnauthorizedResponse(
    res: Response,
    msg = 'Permission denied',
  ):void {
    res.status(401);
    res.json({
      success: false,
      data: null,
      error: msg,
    });
  }

  protected serverErrorResponse(
    res: Response,
    msg: string,
    data: unknown = null,
  ): void {
    res.status(500);
    res.json({
      success: false,
      data,
      error: msg,
    });
  }

  protected successResponse(res: Response, data: unknown = null): void {
    res.status(200);
    res.json({
      success: true,
      data,
      error: null,
    });
  }

  protected setCookie(res: Response, name: string, value: string, options: CookieOptions = {}): void {
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
}
