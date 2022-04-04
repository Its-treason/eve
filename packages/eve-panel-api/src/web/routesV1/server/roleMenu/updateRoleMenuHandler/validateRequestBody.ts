import { Request } from 'express';
import InvalidRequestError from '../../../../error/InvalidRequestError';
import { RoleMenu, RoleMenuEntry } from '../../../../sharedApiTypes';
import RoleMenuProjection from '../../../../../projections/RoleMenuProjection';
import { APIGuild } from 'discord-api-types/v9';
import getApiClient from '../../../../../structures/getApiClient';

interface SaveRoleMenuBody {
  roleMenu: RoleMenu,
}

export default async function validateRequestBody(req: Request, server: APIGuild): Promise<SaveRoleMenuBody|never> {
  const api = await getApiClient();

  if (typeof req.body.message !== 'string') {
    throw new InvalidRequestError('Parameter "message" not valid');
  }
  if (req.body.message.length >= 2000) {
    throw new InvalidRequestError('Parameter "message" is too long');
  }

  if (typeof req.body.id !== 'string') {
    throw new InvalidRequestError('Parameter "id" not valid');
  }
  if (req.body.id.length !== 64) {
    throw new InvalidRequestError('Length of Parameter "id" is not valid');
  }

  if (!Array.isArray(req.body.entries)) {
    throw new InvalidRequestError('Parameter "entries" not valid');
  }

  const entries: RoleMenuEntry[] = [];
  for (const entry of req.body.entries) {
    if (typeof entry.label !== 'string') {
      throw new InvalidRequestError('Parameter "label" of "entries" not valid');
    }
    if (entry.label.length >= 25) {
      throw new InvalidRequestError('Parameter "label" of "entries" not valid');
    }

    if (typeof entry.role !== 'string') {
      throw new InvalidRequestError('Parameter "role" of "entries" not valid');
    }
    if (!await api.getRole(server.id, entry.role)) {
      throw new InvalidRequestError('Parameter "role" of "entries" not valid');
    }

    entries.push({
      emoji: '',
      label: entry.label,
      role: entry.role,
    });
  }

  const oldMenu = await RoleMenuProjection.getRoleMenuRowById(req.body.id);
  if (oldMenu === null) {
    throw new InvalidRequestError('Parameter "id" is invalid');
  }
  
  const roleMenu: RoleMenu = {
    ...oldMenu,
    entries,
    message: req.body.message,
  };

  return {
    roleMenu,
  };
}
