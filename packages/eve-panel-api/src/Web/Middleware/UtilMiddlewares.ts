import { Logger } from 'eve-core';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export default class UtilMiddlewares {
  constructor(
    private logger: Logger,
  ) {}

  public loggerMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const startTime = Date.now();

    next();

    const requestTime = Date.now() - startTime;
    this.logger.info('Api request', {
      path: req.path,
      method: req.method,
      // The `cf-connecting-ip` header is set by Cloudflare
      ip: req.headers['cf-connecting-ip'] || req.ip,
      userAgent: req.headers['User-Agent'] || 'N/A',
      protocol: req.protocol,
      requestTime,
    });
  }

  public corsMiddleware(_req: Request, res: Response, next: NextFunction): void {
    const corsDomain = process.env.CORS_DOMAIN || '*';

    res.setHeader('Access-Control-Allow-Origin', corsDomain);
    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, apiKey');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Cache-Control', 'no-store');
    next();
  }
}
