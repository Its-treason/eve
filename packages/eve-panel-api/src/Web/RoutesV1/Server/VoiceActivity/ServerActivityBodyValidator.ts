import { Request } from 'express';
import { injectable } from 'tsyringe';
import { z } from 'zod';

@injectable()
export default class ServerActivityBodyValidator {
  async validateGetServerActivityBody(req: Request) {
    const body = z.object({
      startDate: z.preprocess((arg) => {
          if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
        }, z.date()),
      endDate: z.preprocess((arg) => {
          if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
        }, z.date()),
    });

    return body.safeParse(req.body);
  }
}
