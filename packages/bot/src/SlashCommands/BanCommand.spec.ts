import { mockClass, PublicLogCategories, PublicLogger } from '@eve/core';
import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import CommandValidator from '../Validation/CommandValidator';
import BanCommand from './BanCommand';
import messageEmbedFactory from '../Factory/messageEmbedFactory';
import AbstractValidationHandler from '../Validation/AbstractValidationHandler';

jest.mock('../Factory/messageEmbedFactory');

describe('BanCommand', () => {
  let command: BanCommand;

  let commandValidator: CommandValidator;
  let publicLogger: PublicLogger;

  beforeEach(() => {
    commandValidator = mockClass(CommandValidator);
    publicLogger = mockClass(PublicLogger);

    command = new BanCommand(commandValidator, publicLogger);
  });

  describe('execute', () => {
    it('Can ban a member', async () => {
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
            ban: jest.fn(),
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

      expect(messageEmbedFactory).toBeCalledWith(interaction.client, 'Banned');

      expect(interaction.reply).toBeCalledWith({
        embeds: [embedBuilder],
        allowedMentions: { repliedUser: true },
      });

      expect(publicLogger.createLog).toBeCalledWith(
        '"action-username" used the "ban" command to ban "target-user"',
        PublicLogCategories.ModerationCommandUsed,
        ['guild-id-123'],
        ['action-user-id', 'some-user-id'],
      );
    });
  });

  describe('getData', () => {
    it('will return correct data', () => {
      const actual = command.getData();

      expect(actual).toMatchObject({
        name: 'ban',
        description: 'Ban a user',
        type: ApplicationCommandType.ChatInput,
        options: [
          {
            name: 'user',
            description: 'User to Ban',
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: 'reason',
            description: 'Ban reason',
            type: ApplicationCommandOptionType.String,
          },
        ],
        dmPermission: false,
        defaultMemberPermissions: PermissionFlagsBits.BanMembers,
      });
    });
  });
});
