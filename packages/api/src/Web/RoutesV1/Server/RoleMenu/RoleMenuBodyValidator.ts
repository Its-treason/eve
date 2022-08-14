import { ChannelType, APIChannel } from 'discord-api-types/v9';
import { ApiClient, RoleMenuRepository } from '@eve/core';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { z, infer } from 'zod';
import { ResponseWithLocals } from '../../../../types';

@injectable()
export default class RoleMenuBodyValidator {
  constructor(
    private api: ApiClient,
    private roleMenuRepository: RoleMenuRepository,
  ) { }

  public async validateCreateRoleMenuBody(req: Request) {
    const body = z.object({
      name: z.string().min(3).max(25),
      channel: z.string().transform(async (value, ctx) => {
        const channel = await this.api.getChannel(value);
        if (channel === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Channel not found',
            fatal: true,
          });
        }
        return (channel as APIChannel);
      }).refine(async (value) => {
        return value.type === ChannelType.GuildText;
      }, 'Channel must be Type "GUILD_TEXT"'),
    });

    return body.safeParseAsync(req.body);
  }

  public async validateDeleteRoleMenuBody(req: Request) {
    const body = z.object({
      roleMenu: z.string().refine(async (value) => {
        const roleMenu = await this.roleMenuRepository.getRoleMenuRowById(value);
        return roleMenu !== null;
      }).transform(async (value) => {
        const roleMenu = await this.roleMenuRepository.getRoleMenuRowById(value);
        if (roleMenu === null) {
          throw new Error('RoleMenu cannot be empty');
        }
        return roleMenu;
      }),
    });

    return body.safeParseAsync(req.body);
  }

  public async validateUpdateRoleMenuBody(req: Request, res: ResponseWithLocals) {
    const body = z.object({
      message: z.string().max(2000),

      roleMenu: z.string().refine(async (value) => {
        const roleMenu = await this.roleMenuRepository.getRoleMenuRowById(value);
        return roleMenu !== null;
      }).transform(async (value) => {
        const roleMenu = await this.roleMenuRepository.getRoleMenuRowById(value);
        if (roleMenu === null) {
          throw new Error('RoleMenu cannot be empty');
        }
        return roleMenu;
      }),

      entries: z.array(z.object({
        label: z.string().min(1).max(25),

        role: z.string().refine(async (value) => {
          const roles = await this.api.getRoles(res.locals.server.id);
          if (!roles) {
            return false;
          }

          for (const role of roles) {
            if (role.id === value) {
              return true;
            }
          }

          return false;
        }, { message: 'Invalid role id' }),

        // Change this to an Emoji validator when emoji picker was added to the frontend
        // Should be empty for now
        emoji: z.object({
          name: z.nullable(z.string()),
          id: z.nullable(z.string()),
          animated: z.boolean().optional(),
        }).optional(),
      })),
    });

    type bodyType = z.infer<typeof body>;

    return body.safeParseAsync(req.body);
  }
}
