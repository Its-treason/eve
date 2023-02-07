import { ApiClient } from '@eve/core';
import { Request } from 'express';
import { singleton } from 'tsyringe';
import { z } from 'zod';

@singleton()
export default class ServerSettingsBodyValidator {
  constructor(
    private apiClient: ApiClient,
  ) {}

  validateGetAutoActionsBody(req: Request) {
    const body = z.object({
      type: z.string(),
    });

    return body.safeParse(req.query);
  }

  async validateSaveAutoActionBody(req: Request, serverId: string) {
    const body = z.object({
      type: z.string(),
      payload: z.object({
        channel: z.string().optional().refine(async (channel) => {
          // Allow no/undefined channel
          if (channel === undefined) {
            return true;
          }
          if (!channel.match(/\d{16,21}/g)) {
            return false;
          }

          const allChannel = await this.apiClient.getChannels(serverId);
          if (!allChannel) {
            return false;
          }
          return !!allChannel.find((extChannel) => extChannel.id === channel);
        }),
      }).passthrough(),
    });

    return await body.safeParseAsync(req.body);
  }
}
