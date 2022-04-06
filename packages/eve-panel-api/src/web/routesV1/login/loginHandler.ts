import { Request, Response } from 'express';
import ApiKeysProjection from '../../../projections/ApiKeysProjection';
import DiscordApiProjection from '../../../projections/DiscordApiProjection';
import generateRandomString from '../../../util/generateRandomString';
import { ResponseHelper } from '../../ResponseHelper';
import { LoginApiResponseData } from '../../sharedApiTypes';
import getReducedUserFromId from '../../../util/getReducedUserFromId';

export default async function loginHandler(req: Request, res: Response): Promise<void> {
  const { code } = req.body;

  if (typeof code !== 'string') {
    ResponseHelper.userErrorResponse(res, 'Invalid Parameter!');
    return;
  }

  let accessToken: string, expiresIn: number, tokenType: string;
  try {
    const discordRes = await DiscordApiProjection.exchangeCodeForToken(code);
    accessToken = discordRes.access_token;
    expiresIn = discordRes.expires_in;
    tokenType = discordRes.token_type;
  } catch (error) {
    ResponseHelper.userUnauthorizedResponse(res);
    return;
  }

  const { id } = await DiscordApiProjection.getUserInfo(tokenType, accessToken);
  if (id === undefined) {
    ResponseHelper.userUnauthorizedResponse(res);
    return;
  }

  const apiKey = generateRandomString();
  await ApiKeysProjection.createApiKey(apiKey, accessToken, expiresIn, tokenType);

  const user = await getReducedUserFromId(id, apiKey);
  if (user === null) {
    ResponseHelper.userUnauthorizedResponse(res);
    return;
  }

  const response: LoginApiResponseData = {
    apiKey,
    user,
  };

  ResponseHelper.successResponse(res, response);
}
