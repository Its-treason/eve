import AbstractController from '../AbstractController';
import { InviteApiResponseData } from '../sharedApiTypes';
import { Request, Response } from 'express';
import { ApiClient } from '@eve/core';
import { injectable } from 'tsyringe';

@injectable()
export default class InviteController extends AbstractController {
  constructor(
    private api: ApiClient,
  ) {
    super();
  }

  public async create(req: Request, res: Response) {
    const botUser = await this.api.getBotUser();

    if (botUser === null) {
      return this.serverErrorResponse(res, 'Could not create Invite');
    }

    const invite = 
      `https://discord.com/api/oauth2/authorize?client_id=${botUser.id}&scope=applications.commands+bot&permissions=8`;
  
    const response: InviteApiResponseData = { invite };

    this.successResponse(res, response);
  }
}
