import { Request } from 'express';
import { singleton } from 'tsyringe';
import { z } from 'zod';

@singleton()
export default class AutoActionsBodyValidator {
  validateGetAutoActionsBody(req: Request) {
    const body = z.object({
      type: z.string(),
    });

    return body.safeParse(req.body);
  }

  validateSaveAutoActionBody(req: Request) {
    const body = z.object({
      type: z.string(),
      payload: z.object({}).passthrough(),
    });

    return body.safeParse(req.body);
  }
}
