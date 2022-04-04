import { Request, Response } from 'express';
import BadHandlerCallError from '../../error/BadHandlerCallError';
import { ResponseHelper } from '../../ResponseHelper';
import { RoleListApiResponseData } from '../../sharedApiTypes';
import getApiClient from '../../../structures/getApiClient';
import { PermissionFlagsBits } from 'discord-api-types/v8';

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!res.locals.server) {
    throw new BadHandlerCallError('Server is not defined');
  }

  const api = await getApiClient();
  let roles = await api.getRoles(res.locals.server.id);
  if (!roles) {
    roles = [];
  }

  const response: RoleListApiResponseData = [];

  for (const role of roles) {
    if (role.managed || role.name === '@everyone') {
      continue;
    }

    const modPerms = [
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageGuild,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.MuteMembers,
      PermissionFlagsBits.DeafenMembers,
      PermissionFlagsBits.MoveMembers,
      PermissionFlagsBits.ManageNicknames,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.ManageWebhooks,
    ];
    const isModerator = modPerms.reduce((acc, perm) => acc || api.roleHasPermission(role, perm), false);

    const isAdmin = api.roleHasPermission(role, PermissionFlagsBits.Administrator);

    response.push({
      id: role.id,
      name: role.name,
      color: role.color.toString(16),
      isAdmin,
      isModerator,
    });
  }

  ResponseHelper.successResponse(res, response);
}
