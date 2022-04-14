import { Request, Response, NextFunction } from 'express';
import getLogger from '../../structures/getLogger';

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const logger = getLogger();

  const startTime = Date.now();

  next();

  const requestTime = Date.now() - startTime;
  logger.info('Api request', {
    path: req.path,
    method: req.method,
    // The `cf-connecting-ip` header is set by Cloudflare
    ip: req.headers['cf-connecting-ip'] || req.ips,
    protocol: req.protocol,
    requestTime,
  });
}
