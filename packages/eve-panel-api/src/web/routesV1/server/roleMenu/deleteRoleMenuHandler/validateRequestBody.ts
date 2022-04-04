import { Request } from 'express';
import InvalidRequestError from '../../../../error/InvalidRequestError';
import { RoleMenu } from '../../../../sharedApiTypes';
import RoleMenuProjection from '../../../../../projections/RoleMenuProjection';
import { APIGuild } from 'discord-api-types/v9';

interface DeleteRoleMenuBody {
  roleMenu: RoleMenu,
}

export default async function validateRequestBody(req: Request, server: APIGuild): Promise<DeleteRoleMenuBody|never> {
  if (typeof req.body.id !== 'string') {
    throw new InvalidRequestError('Parameter "id" not valid');
  }

  const roleMenu = await RoleMenuProjection.getRoleMenuRowById(req.body.id);
  if (roleMenu === null) {
    throw new InvalidRequestError('Parameter "id" is invalid');
  }

  if (roleMenu.serverId !== server.id) {
    throw new InvalidRequestError('Parameter "id" is invalid. Id for different server provided');
  }

  return { roleMenu };
}
