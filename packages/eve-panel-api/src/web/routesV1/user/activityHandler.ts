import { Request, Response } from 'express';
import ChannelActivityProjection from '../../../projections/ChannelActivityProjection';
import { ResponseHelper } from '../../ResponseHelper';
import { UserActivityApiRequestData, UserActivityApiResponseData } from '../../sharedApiTypes';
import ActivityFormatter from '../../../value/ActivityFormatter';
import getApiClient from '../../../structures/getApiClient';

export default async function activityHandler(req: Request, res: Response): Promise<void> {
  const { startDate, endDate } = (req.body as UserActivityApiRequestData);
  const { userId } = req.params;
  const client = await getApiClient();

  const start = new Date(startDate);
  const end = new Date(endDate);

  const rows = await ChannelActivityProjection.getActivityOForUser(userId, start, end);

  const formatter = new ActivityFormatter(client);
  const response: UserActivityApiResponseData = await formatter.format(rows);
  ResponseHelper.successResponse(res, response);
}
