import { Request, Response } from 'express';
import BadHandlerCallError from '../../../error/BadHandlerCallError';
import { ResponseHelper } from '../../../ResponseHelper';
import RoleMenuProjection from '../../../../projections/RoleMenuProjection';

export default async function getRoleMenusHandler(req: Request, res: Response): Promise<void> {
  if (!res.locals.server) {
    throw new BadHandlerCallError('Server is not defined');
  }

  const response = await RoleMenuProjection.getAllForServer(res.locals.server.id);

  ResponseHelper.successResponse(res, response);
}
