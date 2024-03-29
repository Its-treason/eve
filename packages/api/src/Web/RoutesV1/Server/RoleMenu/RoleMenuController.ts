import { injectable } from 'tsyringe';
import { Request } from 'express';
import AbstractController from '../../../AbstractController';
import { RoleMenu, RoleMenuRepository } from '@eve/core';
import RoleMenuBodyValidator from './RoleMenuBodyValidator';
import { ResponseWithLocals } from '../../../../types';
import RoleMenuService from './RoleMenuService';
import RandomHelper from '../../../../Util/RandomHelper';

@injectable()
export default class RoleMenuController extends AbstractController {
  constructor(
    private roleMenuRepository: RoleMenuRepository,
    private bodyValidator: RoleMenuBodyValidator,
    private roleMenuService: RoleMenuService,
    private randomHelper: RandomHelper,
  ) {
    super();
  }

  async getRoleMenusHandler(_req: Request, res: ResponseWithLocals): Promise<void> {
    const response = await this.roleMenuRepository.getAllForServer(res.locals.server.id);
    this.successResponse(res, response);
  }

  async createRoleMenu(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateCreateRoleMenuBody(req);
    if (validationResult.success === false) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { name, channel } = validationResult.data;

    const roleMenu: RoleMenu = {
      id: this.randomHelper.generateRandomString(),
      serverId: res.locals.server.id,
      channelId: channel.id,
      messageId: '',
      message: '',
      entries: [],
      name,
      embed: null,
    };

    await this.roleMenuRepository.saveEntry(roleMenu);

    this.successResponse(res, { acknowledged: true });
  }

  async deleteRoleMenu(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateDeleteRoleMenuBody(req);
    if (validationResult.success === false) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { roleMenu } = validationResult.data;

    this.roleMenuRepository.removeEntry(roleMenu.id);
    this.roleMenuService.deleteMessage(roleMenu);

    this.successResponse(res, { acknowledged: true });
  }

  async updateRoleMenu(req: Request, res: ResponseWithLocals): Promise<void> {
    const validationResult = await this.bodyValidator.validateUpdateRoleMenuBody(req, res);
    if (validationResult.success === false) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { entries, roleMenu: oldRoleMenu, message, embed } = validationResult.data;

    const roleMenu: RoleMenu = {
      ...oldRoleMenu,
      message,
      entries,
      embed,
    };

    const messageId = await this.roleMenuService.createRoleMenuMessage(roleMenu);

    roleMenu.messageId = messageId;

    await this.roleMenuRepository.saveEntry(roleMenu);

    this.successResponse(res, { acknowledged: true });
  }
}
