import { injectable } from 'tsyringe';
import { Request } from 'express';
import AbstractController from '../../AbstractController';
import { ResponseWithLocals } from '../../../types';
import UserFormatter from '../../../Util/UserFormatter';
import { BasicUserInfoApiResponseData } from '../../sharedApiTypes';

@injectable()
export default class UserController extends AbstractController {
  constructor(
    private userFormatter: UserFormatter,
  ) {
    super();
  }

  async getUserInfo(req: Request, res: ResponseWithLocals): Promise<void> {
    const { userId } = req.params;
    const apiKey = res.locals.apiKey;

    const simpleUser = await this.userFormatter.getReducedUserFromId(userId, apiKey);
    if (simpleUser === null) {
      this.userErrorResponse(res, 'User not found');
      return;
    }

    const response: BasicUserInfoApiResponseData = simpleUser;
    this.successResponse(res, response);
  }
}
