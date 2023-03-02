import { ApiKeysRepository, PermissionRepository, ApiClient } from '@eve/core';
import { NextFunction, Response, Request } from 'express';
import { injectable } from 'tsyringe';
import DiscordApiRepository from '../../Repository/DiscordApiRepository';
import BadMiddlewareCallError from '../Error/BadMiddlewareCallError';

@injectable()
export default class AuthMiddlewares {
  constructor(
    private apiKeysRepository: ApiKeysRepository,
    private discordApiRepository: DiscordApiRepository,
    private permissionRepository: PermissionRepository,
    private apiClient: ApiClient,
  ) { }

  authMiddleware(mustBeAdmin: boolean) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Headers are all written in lowercase
      const apiKey = req.headers.apikey;

      if (typeof apiKey !== 'string') {
        this.userUnauthorizedResponse(res, 'Api-Key Missing');
        return;
      }

      const { accessToken, tokenType } = await this.apiKeysRepository.getAccessTokenByApiKey(apiKey);
      if (accessToken === null || tokenType === null) {
        this.userUnauthorizedResponse(res, 'Api-Key invalid');
        return;
      }

      const user = await this.discordApiRepository.getUserInfo(tokenType, accessToken);
      if (user.id === undefined) {
        this.userUnauthorizedResponse(res, 'Invalid Token');
        return;
      }

      const isAdmin = await this.permissionRepository.isUserAdmin(user.id);
      if (mustBeAdmin && !isAdmin) {
        this.userUnauthorizedResponse(res);
        return;
      }

      res.locals.user = user;
      res.locals.isAdmin = isAdmin;
      res.locals.apiKey = apiKey;

      next();
    };
  }

  public async canAccessServerMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!res.locals.user || typeof res.locals.isAdmin !== 'boolean') {
      throw new BadMiddlewareCallError('User or isElevated must be set');
    }

    const { serverId } = req.params;

    const server = await this.apiClient.getGuild(serverId);
    if (server === null) {
      this.userUnauthorizedResponse(res);
      return;
    }

    if (server.owner_id !== res.locals.user.id && !res.locals.isAdmin) {
      this.userUnauthorizedResponse(res);
      return;
    }

    res.locals.server = server;

    next();
  }

  canAccessUserMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!res.locals.user || typeof res.locals.isAdmin !== 'boolean') {
      throw new BadMiddlewareCallError('User and isAdmin must be set');
    }

    const { userId } = req.params;

    if (res.locals.isAdmin || res.locals.user.id === userId) {
      next();
      return;
    }

    this.userUnauthorizedResponse(res);
  }

  private userUnauthorizedResponse(
    res: Response,
    msg = 'Permission denied',
  ): void {
    res.status(401);
    res.json({
      success: false,
      data: null,
      error: msg,
    });
  }
}
