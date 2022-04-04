import { Request, Response } from 'express';
import BadHandlerCallError from '../../../error/BadHandlerCallError';
import {
  SaveAutoActionsRequestData,
  SaveAutoActionsResponseData,
} from '../../../sharedApiTypes';
import { ResponseHelper } from '../../../ResponseHelper';
import AutoActionsProjection from '../../../../projections/AutoActionsProjection';
import actionFactory from '../../../../actions/factory/actionFactory';

export default async function saveActionsHandler(req: Request, res: Response): Promise<void> {
  if (!res.locals.server) {
    throw new BadHandlerCallError('Server is not defined');
  }

  const { type, payload } = (req.body as SaveAutoActionsRequestData);
  
  const action = actionFactory(type, payload);

  await AutoActionsProjection.saveActions(res.locals.server.id, action);

  const response: SaveAutoActionsResponseData = true;
  ResponseHelper.successResponse(res, response);
}
