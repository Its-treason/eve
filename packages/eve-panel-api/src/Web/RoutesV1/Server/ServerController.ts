import { injectable } from 'tsyringe';
import AbstractController from '../../AbstractController';
import { Request, Response } from 'express';
import BadHandlerCallError from '../../Error/BadHandlerCallError';
import { ResponseHelper } from '../../ResponseHelper';
import { BasicServerInfoApiResponseData, ReducedChannel, RoleListApiResponseData } from '../../sharedApiTypes';
import { PermissionFlagsBits } from 'discord-api-types/v8';
import { ApiClient } from 'eve-core';
import { ChannelType } from 'discord-api-types/v9';
import { ResponseWithLocals } from '../../../types';
import EmojiService from '../../../Service/EmojiService';

@injectable()
export default class ServerController extends AbstractController {
  constructor(
    private api: ApiClient,
    private emojiService: EmojiService,
  ) {
    super();
  }

  private static readonly MOD_PERMS = [
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.MuteMembers,
    PermissionFlagsBits.DeafenMembers,
    PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageWebhooks,
  ];

  public async roleList(req: Request, res: Response): Promise<void> {
    if (!res.locals.server) {
      throw new BadHandlerCallError('Server is not defined');
    }

    let roles = await this.api.getRoles(res.locals.server.id);
    if (!roles) {
      roles = [];
    }

    const response: RoleListApiResponseData = [];

    for (const role of roles) {
      if (role.managed || role.name === '@everyone') {
        continue;
      }

      const isModerator = ServerController.MOD_PERMS.reduce(
        (acc, perm) => acc || this.api.roleHasPermission(role, perm),
        false,
      );
      const isAdmin = this.api.roleHasPermission(role, PermissionFlagsBits.Administrator);

      response.push({
        id: role.id,
        name: role.name,
        color: role.color.toString(16),
        isAdmin,
        isModerator,
      });
    }
  
    ResponseHelper.successResponse(res, response);
  }

  async channelList(req: Request, res: Response): Promise<void> {
    if (!res.locals.server) {
      throw new BadHandlerCallError('Server is not defined');
    }

    let channels = await this.api.getChannels(res.locals.server.id);
    if (!channels) {
      channels = [];
    }

    const response: ReducedChannel[] = [];
    for (const channel of channels) {
      if (
        channel.type === ChannelType.GuildCategory
        || channel.type === ChannelType.GuildNewsThread
        || channel.type === ChannelType.GuildPublicThread
        || channel.type === ChannelType.GuildPrivateThread
        || channel.type === ChannelType.GuildNews
      ) {
        continue;
      }

      let type: 'text'|'voice' = 'text';
      if (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice) {
        type = 'voice';
      }

      response.push({
        id: channel.id,
        name: channel.name || '',
        type,
      });
    }

    ResponseHelper.successResponse(res, response);
  }

  async emojiList(req: Request, res: ResponseWithLocals): Promise<void> {
    const guildEmojis = await this.emojiService.getGuildEmojis(res.locals.server.id);
    const generalEmojis = await this.emojiService.getGeneralEmojis();

    const response = { guildEmojis, generalEmojis };
    this.successResponse(res, response);
  }

  async basicInfo(req: Request, res: Response): Promise<void> {
    const response: BasicServerInfoApiResponseData = {
      id: res.locals.server.id,
      name: res.locals.server.name,
      icon: this.api.getGuildIcon(res.locals.server),
    };

    ResponseHelper.successResponse(res, response);
  }
}
