import { Request } from 'express';
import { singleton } from 'tsyringe';
import { z } from 'zod';

@singleton()
export default class PlaylistBodyValidator {
  async validatePlaylistSaveBody(req: Request) {
    const body = z.object({
      name: z.string().min(1).max(32),

      playlistItems: z.array(z.object({
        ytId: z.string().length(11),
        url: z.string().url(),
        title: z.string(),
        uploader: z.string(),
      })),
    });

    return body.safeParse(req.body);
  }

  async validatePlaylistViewBody(req: Request) {
    const body = z.object({
      name: z.string().min(1).max(32),
    });

    return body.safeParse(req.body);
  }

  async validatePlaylistDeleteBody(req: Request) {
    const body = z.object({
      name: z.string().min(1).max(32),
    });

    return body.safeParse(req.body);
  }
}
