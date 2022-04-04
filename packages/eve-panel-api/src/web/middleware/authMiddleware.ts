import { Response, Request, NextFunction } from 'express';
import ApiKeysProjection from '../../projections/ApiKeysProjection';
import DiscordApiProjection from '../../projections/DiscordApiProjection';
import PermissionProjection from '../../projections/PermissionProjection';
import { ResponseHelper } from '../ResponseHelper';
import getApiClient from '../../structures/getApiClient';

export default function authMiddleware(mustBeElevated: boolean) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Headers are all written in lowercase
    const apiKey = req.headers.apikey;

    if (typeof apiKey !== 'string') {
      ResponseHelper.userUnauthorizedResponse(res, 'Api-Key Missing');
      return;
    }

    const { accessToken, tokenType } = await ApiKeysProjection.getAccessTokenByApiKey(apiKey);
    if (accessToken === null || tokenType === null) {
      ResponseHelper.userUnauthorizedResponse(res, 'Api-Key invalid');
      return;
    }

    const user = await DiscordApiProjection.getUserInfo(tokenType, accessToken);
    if (user.id === undefined) {
      ResponseHelper.userUnauthorizedResponse(res, 'Invalid Token');
      return;
    }

    const isAdmin = await PermissionProjection.isUserAdmin(user.id);
    if (mustBeElevated && !isAdmin) {
      ResponseHelper.userUnauthorizedResponse(res);
      return;
    }

    res.locals.user = user;
    res.locals.isAdmin = isAdmin;
    res.locals.apiKey = apiKey;

    next();
  };
}
