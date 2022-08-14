import { Request } from 'express';
import { singleton } from 'tsyringe';
import { z } from 'zod';

@singleton()
export default class MusicSearchBodyValidator {
  async validateSearchBody(req: Request) {
    const body = z.object({
      query: z.string(),
    });

    return body.safeParse(req.body);
  }

  async validateSpotifyPreviewBody(req: Request) {
    const body = z.object({
      query: z.string(),
    });

    return body.safeParse(req.body);
  }

  async validateSpotifyImportBody(req: Request) {
    const body = z.object({
      query: z.string(),
      name: z.string().min(1).max(32),
    });

    return body.safeParse(req.body);
  }
}
