import { ApiClient, ChannelActivityRepository } from 'eve-core';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { ResponseWithLocals } from '../../../../types';
import FormattingHelper from '../../../../Util/FormattingHelper';
import ActivityFormatter from '../../../../Value/ActivityFormatter';
import AbstractController from '../../../AbstractController';
import { UserActivityApiResponseData } from '../../../sharedApiTypes';
import UserActivityBodyValidator from './UserActivityBodyValidator';

@injectable()
export default class UserActivityController extends AbstractController {
  constructor(
    private bodyValidator: UserActivityBodyValidator,
    private channelActivityRepository: ChannelActivityRepository,
    private apiClient: ApiClient,
    private formattingHelper: FormattingHelper,
  ) {
    super();
  }

  public async getUserActivity(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validateGetUserActivityBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { userId } = req.params;
    const { startDate, endDate } = validationResult.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const rows = await this.channelActivityRepository.getActivityOForUser(userId, start, end);

    const formatter = new ActivityFormatter(this.apiClient, this.formattingHelper);
    const response: UserActivityApiResponseData = await formatter.format(rows);
    this.successResponse(res, response);
  }
}
