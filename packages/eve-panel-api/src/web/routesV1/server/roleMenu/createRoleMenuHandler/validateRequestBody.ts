import { Request } from 'express';
import InvalidRequestError from '../../../../error/InvalidRequestError';
import getApiClient from '../../../../../structures/getApiClient';
import { APIChannel, APIGuild } from 'discord-api-types/v9';

interface SaveRoleMenuBody {
  name: string,
  channel: APIChannel,
}

export default async function validateRequestBody(req: Request, server: APIGuild): Promise<SaveRoleMenuBody|never> {
  const api = await getApiClient();
  
  if (typeof req.body.name !== 'string') {
    throw new InvalidRequestError('Parameter "name" not valid');
  }
  if (req.body.name.length >= 25) {
    throw new InvalidRequestError('Parameter "name" is too long, must not be longer than 25 characters');
  }
  if (req.body.name.length <= 3) {
    throw new InvalidRequestError('Parameter "name" is too short, must be more than 3 characters');
  }

  if (typeof req.body.channelId !== 'string' || req.body.channelId.length !== 18) {
    throw new InvalidRequestError('Parameter "channelId" not valid');
  }

  const channel = await api.getChannel(req.body.channelId);

  if (channel === null) {
    throw new InvalidRequestError('Parameter "channelId" is invalid');
  }

  if (channel.guild_id !== server.id) {
    throw new InvalidRequestError('Parameter "channelId" is invalid because its from a different guild');
  }

  return {
    channel,
    name: req.body.name,
  };
}
