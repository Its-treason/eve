import { ChannelType, APIChannel } from 'discord-api-types/v9';
import { ApiClient, RoleMenuRepository } from '@eve/core';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { z } from 'zod';
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

      embed: z.object({
        title: z.string().max(256),

        description: z.string().max(4096),

        color: z.string().refine((value) => /^#([0-9a-fA-F]{3}){1,2}$/i.test(value)),

        footer: z.string().max(2048),

        fields: z.array(z.object({
          name: z.string().max(256),

          value: z.string().max(1024),

          inline: z.boolean(),
        })),
      }).superRefine((embed, ctx) => {
        let characterCount = 0;
      
        characterCount += embed.description.length;
        characterCount += embed.title.length;
        characterCount += embed.footer.length;
        for (const field of embed.fields) {
          characterCount += field.name.length;
          characterCount += field.value.length;
        }
      
        if (characterCount === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            type: 'string',
            inclusive: true,
            message: 'Embed must not be empty',
            fatal: true,
          });
        }
        if (characterCount > 5900) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            maximum: 5900,
            type: 'string',
            inclusive: true,
            message: 'Length of all Embed fields must not be greater then 5900 characters',
            fatal: true,
          });
        }
      }).nullable(),

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

        color: z.number().min(1).max(4),

        // Change this to an Emoji validator when emoji picker was added to the frontend
        // Should be empty for now
        emoji: z.object({
          name: z.nullable(z.string()),
          id: z.nullable(z.string()),
          animated: z.boolean().optional(),
        }).optional(),
      })),
    });

    return body.safeParseAsync(req.body);
  }
}
