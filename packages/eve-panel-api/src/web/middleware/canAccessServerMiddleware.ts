import { Response, Request, NextFunction } from 'express';
import BadMiddlewareCallError from '../error/BadMiddlewareCallError';
import { ResponseHelper } from '../ResponseHelper';
import getApiClient from '../../structures/getApiClient';

export default async function canAccessServerMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!res.locals.user || typeof res.locals.isAdmin !== 'boolean') {
    throw new BadMiddlewareCallError('User or isElevated must be set');
  }

  const api = await getApiClient();

  const { serverId } = req.params;

  const server = await api.getGuild(serverId);
  if (server === null) {
    ResponseHelper.userUnauthorizedResponse(res);
    return;
  }

  const member = await api.getGuildMember(server.id, res.locals.user.id);
  if (!member || (server.owner_id !== res.locals.user.id && !res.locals.isAdmin)) {
    ResponseHelper.userUnauthorizedResponse(res);
    return;
  }

  res.locals.server = server;

  next();
}
