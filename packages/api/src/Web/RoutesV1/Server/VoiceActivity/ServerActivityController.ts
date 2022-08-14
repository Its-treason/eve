import { ApiClient, ChannelActivityRepository } from '@eve/core';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { ResponseWithLocals } from '../../../../types';
import FormattingHelper from '../../../../Util/FormattingHelper';
import ActivityFormatter from '../../../../Value/ActivityFormatter';
import AbstractController from '../../../AbstractController';
import ServerActivityBodyValidator from './ServerActivityBodyValidator';

@injectable()
export default class ServerActivityController extends AbstractController {
  constructor(
    private bodyValidator: ServerActivityBodyValidator,
    private channelActivityRepository: ChannelActivityRepository,
    private apiClient: ApiClient,
    private formattingHelper: FormattingHelper,
  ) {
    super();
  }

  public async getServerActivity(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validateGetServerActivityBody(req);
    if (validationResult.success === false) {
      this.serverErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { serverId } = req.params;
    const { startDate, endDate } = validationResult.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const rows = await this.channelActivityRepository.getActivityForServer(serverId, start, end);

    const formatter = new ActivityFormatter(this.apiClient, this.formattingHelper);
    const response = await formatter.format(rows);
    this.successResponse(res, response);
  }

  public async getServerActivityAsCsv(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validateGetServerActivityBody(req);
    if (validationResult.success === false) {
      this.serverErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { serverId } = req.params;
    const { startDate, endDate } = validationResult.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const rows = await this.channelActivityRepository.getActivityForServer(serverId, start, end);

    const formatter = new ActivityFormatter(this.apiClient, this.formattingHelper);
    const activityRows = await formatter.format(rows);

    const csvHeader = 'channelName,channelId,serverName,serverId,guildName,guildId,joinedAt,leftAt';

    const csvData = activityRows.reduce((acc, value) => {
      const csvLine = [value.channelName, value.channelId, value.userName, value.userId, value.guildName, value.guildId, value.joinedAt, value.leftAt].join('","');

      return acc + '\n"' + csvLine + '"';
    }, csvHeader);

    this.successResponse(res, csvData);
  }
}
