import { ApiKeysRepository } from '@eve/core';
import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import DiscordApiRepository from '../../Repository/DiscordApiRepository';
import AbstractController from '../AbstractController';
import { LoginApiResponseData, LogoutApiResponseData, VerifyApiResponseData } from '../sharedApiTypes';
import { APIUser } from 'discord-api-types/v9';
import UserFormatter from '../../Util/UserFormatter';
import RandomHelper from '../../Util/RandomHelper';

@injectable()
export default class LoginController extends AbstractController {
  constructor(
    private discordApiRepository: DiscordApiRepository,
    private apiKeyRepository: ApiKeysRepository,
    private userFormatter: UserFormatter,
    private randomHelper: RandomHelper,
  ) {
    super();
  }

  public async login(req: Request, res: Response) {
    const { code } = req.body;

    if (typeof code !== 'string') {
      this.userErrorResponse(res, 'Invalid Parameter!');
      return;
    }

    let accessToken: string, expiresIn: number, tokenType: string;
    try {
      const discordRes = await this.discordApiRepository.exchangeCodeForToken(code);
      accessToken = discordRes.access_token;
      expiresIn = discordRes.expires_in;
      tokenType = discordRes.token_type;
    } catch (error) {
      this.userUnauthorizedResponse(res);
      return;
    }

    const { id } = await this.discordApiRepository.getUserInfo(tokenType, accessToken);
    if (id === undefined) {
      this.userUnauthorizedResponse(res);
      return;
    }

    const apiKey = this.randomHelper.generateRandomString();
    await this.apiKeyRepository.createApiKey(apiKey, accessToken, expiresIn, tokenType);

    const user = await this.userFormatter.getReducedUserFromId(id, apiKey);
    if (user === null) {
      this.userUnauthorizedResponse(res);
      return;
    }

    const response: LoginApiResponseData = {
      apiKey,
      user,
    };
  
    this.successResponse(res, response);
  }

  public async logout(req: Request, res: Response) {
    const apiKey = req.headers.apikey;

    if (typeof apiKey === 'string') {
      await this.apiKeyRepository.deleteApiKey(apiKey);
    }

    const response: LogoutApiResponseData = { loggedOut: true };
    this.successResponse(res, response);
  }

  public async verify(req: Request, res: Response) {
    const user: APIUser = res.locals.user;
    const apiKey: string = res.locals.apiKey;

    const simpleUser = await this.userFormatter.getReducedUserFromId(user.id, apiKey);
    if (simpleUser === null) {
      this.userUnauthorizedResponse(res);
      return;
    }

    const response: VerifyApiResponseData = simpleUser;
    this.successResponse(res, response);
  }
}
