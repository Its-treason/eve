import { Request, Response } from 'express';
import BadHandlerCallError from '../../../error/BadHandlerCallError';
import { GetAutoActionsRequestData, GetAutoActionsResponseData } from '../../../sharedApiTypes';
import { ResponseHelper } from '../../../ResponseHelper';
import AutoActionsProjection from '../../../../projections/AutoActionsProjection';

export default async function getActionsHandler(req: Request, res: Response): Promise<void> {
  if (!res.locals.server) {
    throw new BadHandlerCallError('Server is not defined');
  }

  const { type } = (req.body as GetAutoActionsRequestData);

  const action = await AutoActionsProjection.getActions(res.locals.server.id, type);

  const response: GetAutoActionsResponseData = action.getPayload();
  ResponseHelper.successResponse(res, response);
}
