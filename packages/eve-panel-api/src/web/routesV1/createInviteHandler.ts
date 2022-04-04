import { Request, Response } from 'express';
import { ResponseHelper } from '../ResponseHelper';
import { InviteApiResponseData } from '../sharedApiTypes';
import getApiClient from '../../structures/getApiClient';

export default async function createInviteHandler(req: Request, res: Response): Promise<void> {
  const api = await getApiClient();

  const botUser = await api.getBotUser();

  const invite = 
    `https://discord.com/api/oauth2/authorize?client_id=${botUser?.id}&scope=applications.commands+bot&permissions=8`;

  const response: InviteApiResponseData = { invite };
  
  ResponseHelper.successResponse(res, response);
}
