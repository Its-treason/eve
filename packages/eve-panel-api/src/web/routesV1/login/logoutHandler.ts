import { Request, Response } from 'express';
import ApiKeysProjection from '../../../projections/ApiKeysProjection';
import { ResponseHelper } from '../../ResponseHelper';
import { LogoutApiResponseData } from '../../sharedApiTypes';

export default async function logoutHandler(req: Request, res: Response): Promise<void> {
  const apiKey = req.headers.apikey;

  if (typeof apiKey === 'string') {
    await ApiKeysProjection.deleteApiKey(apiKey);
  }

  const response: LogoutApiResponseData = { loggedOut: true };
  ResponseHelper.successResponse(res, response);
}
