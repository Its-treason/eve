import { Request, Response } from 'express';
import BadHandlerCallError from '../../../../error/BadHandlerCallError';
import { ResponseHelper } from '../../../../ResponseHelper';
import RoleMenuProjection from '../../../../../projections/RoleMenuProjection';
import validateRequestBody from './validateRequestBody';
import InvalidRequestError from '../../../../error/InvalidRequestError';
import { RoleMenu } from '../../../../sharedApiTypes';
import getApiClient from '../../../../../structures/getApiClient';

export default async function deleteRoleMenuHandler(req: Request, res: Response): Promise<void> {
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

  await RoleMenuProjection.removeEntry(params.roleMenu.id);
  await deleteMessage(params.roleMenu);

  ResponseHelper.successResponse(res, { acknowledged: true });
}

async function deleteMessage(roleMenu: RoleMenu): Promise<void> {
  if (roleMenu.messageId === '') {
    return;
  }

  const api = await getApiClient();

  const channel = await api.getChannel(roleMenu.channelId);
  if (channel === null) {
    return;
  }

  const message = await api.getMessage(channel.id, roleMenu.messageId);
  if (message === null) {
    return;
  }

  await api.deleteMessage(channel.id, message.id);
}
