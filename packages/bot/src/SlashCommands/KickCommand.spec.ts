import { mockClass, PublicLogCategories, PublicLogger } from '@eve/core';
import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { beforeEach, describe } from 'node:test';
import messageEmbedFactory from '../Factory/messageEmbedFactory';
import AbstractValidationHandler from '../Validation/AbstractValidationHandler';
import CommandValidator from '../Validation/CommandValidator';
import KickCommand from './KickCommand';

jest.mock('../Factory/messageEmbedFactory');

describe('KickCommand', () => {
  let command: KickCommand;

  let commandValidator: CommandValidator;
  let publicLogger: PublicLogger;

  beforeEach(() => {
    commandValidator = mockClass(CommandValidator);
    publicLogger = mockClass(PublicLogger);

    command = new KickCommand(commandValidator, publicLogger);
  });

  describe('Execute', () => {
    it('Can kick a member', async () => {
      const embedBuilder = {
        setDescription: jest.fn(),
        addFields: jest.fn(),
      } as unknown as EmbedBuilder;

      const interaction = {
        options: {
          getUser: jest.fn(() => {
            return { id: 'some-user-id', username: 'target-user' };
          }),
          getString: jest.fn(() => {
            return 'did an oppsie';
          }),
        },
        user: {
          username: 'action-username',
          discriminator: '1337',
          id: 'action-user-id',
        },
        guild: {
          members: {
            kick: jest.fn(),
          },
          id: 'guild-id-123',
        },
        client: {},
        reply: jest.fn(),
      } as unknown as ChatInputCommandInteraction;

      (messageEmbedFactory as jest.Mock).mockReturnValue(embedBuilder);

      commandValidator.validate = jest.fn(async (
        innerInteraction: ChatInputCommandInteraction,
        validators: AbstractValidationHandler[],
        callback: (command: ChatInputCommandInteraction) => void,
      ) => {
        expect(innerInteraction).toBe(interaction);

        callback(innerInteraction);
      });

      await command.execute(interaction);

      expect(messageEmbedFactory).toBeCalledWith(interaction.client, 'Kicked');

      expect(interaction.reply).toBeCalledWith({
        embeds: [embedBuilder],
        allowedMentions: { repliedUser: true },
      });
      expect(interaction.guild?.members.kick).toBeCalled();

      expect(publicLogger.createLog).toBeCalledWith(
        '"action-username" used the "kick" command to kick "target-user"',
        PublicLogCategories.ModerationCommandUsed,
        ['guild-id-123'],
        ['action-user-id', 'some-user-id'],
      );
    });
  });

  describe('getData', () => {
    it('Can get command data', () => {
      const expected = {
        name: 'kick',
        description: 'Kick a user',
        type: ApplicationCommandType.ChatInput,
        options: [
          {
            name: 'user',
            description: 'User to kick',
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: 'reason',
            description: 'Kick reason',
            type: ApplicationCommandOptionType.String,
          },
        ],
        dmPermission: false,
        defaultMemberPermissions: PermissionFlagsBits.KickMembers,
      };

      expect(command.getData()).toMatchObject(expected);
    });
  });
});
