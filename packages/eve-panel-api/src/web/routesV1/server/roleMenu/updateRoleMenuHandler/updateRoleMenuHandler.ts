import { Request, Response } from 'express';
import BadHandlerCallError from '../../../../error/BadHandlerCallError';
import { ResponseHelper } from '../../../../ResponseHelper';
import RoleMenuProjection from '../../../../../projections/RoleMenuProjection';
import validateRequestBody from './validateRequestBody';
import InvalidRequestError from '../../../../error/InvalidRequestError';
import createRoleMenuMessage from './createRoleMenuMessage';

export default async function updateRoleMenuHandler(req: Request, res: Response): Promise<void> {
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

  const messageId = await createRoleMenuMessage(params.roleMenu);
  await RoleMenuProjection.updateEntry(params.roleMenu.id, params.roleMenu.entries, params.roleMenu.message, messageId);

  ResponseHelper.successResponse(res, { acknowledged: messageId !== '' });
}
