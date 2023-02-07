import { singleton } from 'tsyringe';
import { Request } from 'express';
import { ResponseWithLocals } from '../../../../types';
import AbstractController from '../../../AbstractController';
import ServerSettingsBodyValidator from './ServerSettingsBodyValidator';
import { GetAutoActionsResponseData } from '../../../sharedApiTypes';
import { ServerSettingsFactory, ServerSettingsRepository } from '@eve/core';

@singleton()
export default class ServerSettingsController extends AbstractController {
  constructor(
    private bodyValidator: ServerSettingsBodyValidator,
    private serverSettingsRepository: ServerSettingsRepository,
    private serverSettingsFactory: ServerSettingsFactory,
  ) {
    super();
  }

  async getSetting(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateGetAutoActionsBody(req);
    if (validationResult.success === false) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { type } = validationResult.data;

    const setting = await this.serverSettingsRepository.getSetting(res.locals.server.id, type);

    const response: GetAutoActionsResponseData = setting.getPayload();
    this.successResponse(res, response);
  }

  async saveSetting(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateSaveAutoActionBody(req, res.locals.server.id);
    if (validationResult.success === false) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { type, payload } = validationResult.data;

    const setting = this.serverSettingsFactory.createAction(type, payload);
  
    await this.serverSettingsRepository.saveSetting(res.locals.server.id, setting);

    this.successResponse(res, { acknowledged: true });
  }
}
