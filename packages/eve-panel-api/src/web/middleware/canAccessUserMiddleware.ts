import { Response, Request, NextFunction } from 'express';
import BadMiddlewareCallError from '../error/BadMiddlewareCallError';
import { ResponseHelper } from '../ResponseHelper';

export default async function canAccessUserMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!res.locals.user || typeof res.locals.isAdmin !== 'boolean') {
    throw new BadMiddlewareCallError('User and isAdmin must be set');
  }

  const { userId } = req.params;

  if (res.locals.isAdmin || res.locals.user.id === userId) {
    next();
    return;
  }

  ResponseHelper.userUnauthorizedResponse(res);
}
