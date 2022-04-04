import { Request, Response } from 'express';
import BadHandlerCallError from '../../error/BadHandlerCallError';
import { ResponseHelper } from '../../ResponseHelper';
import { BasicServerInfoApiResponseData } from '../../sharedApiTypes';
import getApiClient from '../../../structures/getApiClient';

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!res.locals.server) {
    throw new BadHandlerCallError('Server is not defined');
  }

  const api = await getApiClient();

  const response: BasicServerInfoApiResponseData = {
    id: res.locals.server.id,
    name: res.locals.server.name,
    icon: api.getGuildIcon(res.locals.server),
  };

  ResponseHelper.successResponse(res, response);
}
