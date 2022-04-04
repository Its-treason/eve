import { Request, Response } from 'express';
import BadHandlerCallError from '../../error/BadHandlerCallError';
import { ResponseHelper } from '../../ResponseHelper';
import { ReducedChannel } from '../../sharedApiTypes';
import getApiClient from '../../../structures/getApiClient';
import { ChannelType } from 'discord-api-types/payloads/v9/channel';

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!res.locals.server) {
    throw new BadHandlerCallError('Server is not defined');
  }

  const api = await getApiClient();
  let channels = await api.getChannels(res.locals.server.id);
  if (!channels) {
    channels = [];
  }

  const response: ReducedChannel[] = [];
  for (const channel of channels) {
    if (
      channel.type === ChannelType.GuildCategory
      || channel.type === ChannelType.GuildNewsThread
      || channel.type === ChannelType.GuildPublicThread
      || channel.type === ChannelType.GuildPrivateThread
      || channel.type === ChannelType.GuildNews
    ) {
      continue;
    }

    let type: 'text'|'voice' = 'text';
    if (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice) {
      type = 'voice';
    }

    response.push({
      id: channel.id,
      name: channel.name || '',
      type,
    });
  }

  ResponseHelper.successResponse(res, response);
}
