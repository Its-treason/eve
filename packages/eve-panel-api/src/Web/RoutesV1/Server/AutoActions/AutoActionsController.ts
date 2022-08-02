import { singleton } from 'tsyringe';
import { Request } from 'express';
import { ResponseWithLocals } from '../../../../types';
import AbstractController from '../../../AbstractController';
import AutoActionsBodyValidator from './AutoActionsBodyValidator';
import { ActionFactory, AutoActionsRepository } from 'eve-core';
import { GetAutoActionsResponseData } from '../../../sharedApiTypes';

@singleton()
export default class AutoActionsController extends AbstractController {
  constructor(
    private bodyValidator: AutoActionsBodyValidator,
    private autoActionsRepository: AutoActionsRepository,
    private actionFactory: ActionFactory,
  ) {
    super();
  }

  async getAutoActions(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateGetAutoActionsBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { type } = validationResult.data;

    const action = await this.autoActionsRepository.getActions(res.locals.server.id, type);
    if (action === false) {
      return this.userErrorResponse(res, 'Invalid Auto action');
    }

    const response: GetAutoActionsResponseData = action.getPayload();
    this.successResponse(res, response);
  }

  async saveAutoAction(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateSaveAutoActionBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { type, payload } = validationResult.data;

    const action = this.actionFactory.createAction(type, payload);
  
    await this.autoActionsRepository.saveActions(res.locals.server.id, action);

    this.successResponse(res, { acknowledged: true });
  }
}
