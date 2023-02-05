import { singleton } from 'tsyringe';
import { Request } from 'express';
import { ResponseWithLocals } from '../../../../types';
import AbstractController from '../../../AbstractController';
import AutoActionsBodyValidator from './AutoActionsBodyValidator';
import { GetAutoActionsResponseData } from '../../../sharedApiTypes';
import { ServerSettingsFactory, ServerSettingsRepository } from '@eve/core';

@singleton()
export default class AutoActionsController extends AbstractController {
  constructor(
    private bodyValidator: AutoActionsBodyValidator,
    private serverSettingsRepository: ServerSettingsRepository,
    private serverSettingsFactory: ServerSettingsFactory,
  ) {
    super();
  }

  async getAutoActions(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateGetAutoActionsBody(req);
    if (validationResult.success === false) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { type } = validationResult.data;

    const action = await this.serverSettingsRepository.getSetting(res.locals.server.id, type);

    const response: GetAutoActionsResponseData = action.getPayload();
    this.successResponse(res, response);
  }

  async saveAutoAction(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateSaveAutoActionBody(req);
    if (validationResult.success === false) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { type, payload } = validationResult.data;

    const action = this.serverSettingsFactory.createAction(type, payload);
  
    await this.serverSettingsRepository.saveSetting(res.locals.server.id, action);

    this.successResponse(res, { acknowledged: true });
  }
}
