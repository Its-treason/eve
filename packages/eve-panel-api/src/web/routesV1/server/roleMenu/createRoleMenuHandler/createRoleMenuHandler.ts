import { Request, Response } from 'express';
import BadHandlerCallError from '../../../../error/BadHandlerCallError';
import { ResponseHelper } from '../../../../ResponseHelper';
import RoleMenuProjection from '../../../../../projections/RoleMenuProjection';
import validateRequestBody from './validateRequestBody';
import InvalidRequestError from '../../../../error/InvalidRequestError';
import generateRandomString from '../../../../../util/generateRandomString';

export default async function createRoleMenuHandler(req: Request, res: Response): Promise<void> {
  if (!res.locals.server) {
    throw new BadHandlerCallError('Server is not defined');
  }

  let params;
  try {
    params = await validateRequestBody(req, res.locals.server);
  } catch (e) {
    if (!(e instanceof InvalidRequestError)) {
      throw e;
    }
    
    ResponseHelper.userErrorResponse(res, e.message);
    return;
  }

  await RoleMenuProjection.saveEntry(
    generateRandomString(),
    res.locals.server.id,
    params.channel.id,
    '',
    [],
    '',
    params.name,
  );

  ResponseHelper.successResponse(res, { acknowledged: true });
}
