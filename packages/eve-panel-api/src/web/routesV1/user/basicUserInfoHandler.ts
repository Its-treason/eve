import { Request, Response } from 'express';
import { ResponseHelper } from '../../ResponseHelper';
import getReducedUserFromId from '../../../util/getReducedUserFromId';
import { BasicUserInfoApiResponseData } from '../../sharedApiTypes';

export default async function handler(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const apiKey = res.locals.apiKey;

  const simpleUser = await getReducedUserFromId(userId, apiKey);
  if (simpleUser === null) {
    ResponseHelper.userErrorResponse(res, 'User not found');
    return;
  }

  const response: BasicUserInfoApiResponseData = simpleUser;
  ResponseHelper.successResponse(res, response);
}
