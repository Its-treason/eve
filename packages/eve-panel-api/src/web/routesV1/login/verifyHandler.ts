import { Request, Response } from 'express';
import { ResponseHelper } from '../../ResponseHelper';
import getReducedUserFromId from '../../../util/getReducedUserFromId';
import { VerifyApiResponseData } from '../../sharedApiTypes';
import { APIUser } from 'discord-api-types/v9';

export default async function verifyHandler(req: Request, res: Response): Promise<void> {
  const user: APIUser = res.locals.user;
  const apiKey: string = res.locals.apiKey;

  const simpleUser = await getReducedUserFromId(user.id, apiKey);
  if (simpleUser === null) {
    ResponseHelper.userUnauthorizedResponse(res);
    return;
  }

  const response: VerifyApiResponseData = simpleUser;
  ResponseHelper.successResponse(res, response);
}
