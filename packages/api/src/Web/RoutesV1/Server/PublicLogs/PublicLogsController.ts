import { Request } from 'express';
import { ResponseWithLocals } from '../../../../types';
import AbstractController from '../../../AbstractController';
import { PublicLogsRepository } from '@eve/core';
import { singleton } from 'tsyringe';
import PublicLogsService from './PublicLogsService';

@singleton()
export default class PublicLogsController extends AbstractController {
  constructor(
    private publicLogsRepository: PublicLogsRepository,
    private publicLogsService: PublicLogsService,
  ) {
    super();
  }

  async getAllLogs(req: Request, res: ResponseWithLocals): Promise<void> {
    const rawLogs = await this.publicLogsRepository.getLogsForServer(res.locals.server.id);

    const formattedLogs = await this.publicLogsService.formatRawLogs(rawLogs);

    this.successResponse(res, formattedLogs);
  }
}
