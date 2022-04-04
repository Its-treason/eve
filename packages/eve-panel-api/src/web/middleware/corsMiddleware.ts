import { Request, Response, NextFunction } from 'express';

export default function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
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
