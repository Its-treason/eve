import { NextFunction, Request, Response } from 'express';
import getLogger from '../../structures/getLogger';
import {ResponseHelper} from "../ResponseHelper";

const logger = getLogger();

export default function catchError(
  fn: (req: Request, res: Response, next: NextFunction) => void,
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error('An error Occurred in a handler!', { error: (error as Error) });
      ResponseHelper.serverErrorResponse(res, 'Internal server Error');
    }

    next();
  };
}
