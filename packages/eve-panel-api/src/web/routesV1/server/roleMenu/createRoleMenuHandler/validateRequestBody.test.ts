import validateRequestBody from './validateRequestBody';
import { Request } from 'express';
import InvalidRequestError from '../../../../error/InvalidRequestError';
import { APIChannel, APIGuild } from 'discord-api-types/v9';

describe('Can validate CreateRoleMenu request', () => {
  it('Can pass on valid request', async () => {
    const name = 'test';
    const channelId = '845635867737718784';
    const guildId = '574389020239393953';

    const req = {
      body: {
        name,
        channelId,
      },
    } as Request;

    const channel = {
      'guild_id': guildId,
    } as APIChannel;

    const fetchChannelMock = jest.fn();
    fetchChannelMock.mockReturnValueOnce(channel);

    const server = {
      channels: {
        fetch: fetchChannelMock,
      },
      id: guildId,
    } as unknown as APIGuild;

    const actual = await validateRequestBody(req, server);

    expect(actual.name).toBe(name);
    expect(actual.channel).toBe(channel);

    expect(fetchChannelMock.mock.calls[0][0]).toBe(channelId);
    expect(fetchChannelMock.mock.calls.length).toBe(1);
  });

  it('Can will throw error when name not set', async () => {
    const channelId = '845635867737718784';
    const guildId = '574389020239393953';

    const req = {
      body: {
        channelId,
      },
    } as Request;

    const channel = {
      'guild_id': guildId,
    } as APIChannel;

    const fetchChannelMock = jest.fn();
    fetchChannelMock.mockReturnValueOnce(channel);

    const server = {
      channels: {
        fetch: fetchChannelMock,
      },
      id: guildId,
    } as unknown as APIGuild;

    try {
      await validateRequestBody(req, server);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error).toHaveProperty('message', 'Parameter "name" not valid');
    }
  });

  it('Can will throw error when name is too long', async () => {
    const name = 'testtesttesttesttesttesttest';
    const channelId = '845635867737718784';
    const guildId = '574389020239393953';

    const req = {
      body: {
        channelId,
        name,
      },
    } as Request;

    const channel = {
      'guild_id': guildId,
    } as APIChannel;

    const fetchChannelMock = jest.fn();
    fetchChannelMock.mockReturnValueOnce(channel);

    const server = {
      channels: {
        fetch: fetchChannelMock,
      },
      id: guildId,
    } as unknown as APIGuild;

    try {
      await validateRequestBody(req, server);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error).toHaveProperty('message', 'Parameter "name" is too long');
    }
  });

  it('Can will throw error when channelId is not set', async () => {
    const name = 'test';
    const guildId = '574389020239393953';

    const req = {
      body: {
        name,
      },
    } as Request;

    const channel = {
      'guild_id': guildId,
    } as APIChannel;

    const fetchChannelMock = jest.fn();
    fetchChannelMock.mockReturnValueOnce(channel);

    const server = {
      channels: {
        fetch: fetchChannelMock,
      },
      id: guildId,
    } as unknown as APIGuild;

    try {
      await validateRequestBody(req, server);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error).toHaveProperty('message', 'Parameter "channelId" not valid');
    }
  });

  it('Can will throw error when channel could not be fetched', async () => {
    const name = 'test';
    const channelId = '845635867737718784';
    const guildId = '574389020239393953';

    const req = {
      body: {
        name,
        channelId,
      },
    } as Request;

    const fetchChannelMock = jest.fn();
    fetchChannelMock.mockReturnValueOnce(null);

    const server = {
      channels: {
        fetch: fetchChannelMock,
      },
      id: guildId,
    } as unknown as APIGuild;

    try {
      await validateRequestBody(req, server);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error).toHaveProperty('message', 'Parameter "channelId" is invalid');
    }
  });

  it('Can will throw error when channel error is thrown while fetching channel', async () => {
    const name = 'test';
    const channelId = '845635867737718784';
    const guildId = '574389020239393953';

    const req = {
      body: {
        name,
        channelId,
      },
    } as Request;

    const fetchChannelMock = jest.fn();
    fetchChannelMock.mockImplementation(() => {
      throw new Error('Some Discord Error');
    });

    const server = {
      channels: {
        fetch: fetchChannelMock,
      },
      id: guildId,
    } as unknown as APIGuild;

    try {
      await validateRequestBody(req, server);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error).toHaveProperty('message', 'Parameter "channelId" is invalid');
    }
  });

  it('Can will throw error when channel for different server was provided', async () => {
    const name = 'test';
    const channelId = '845635867737718784';
    const guildId = '574389020239393953';

    const req = {
      body: {
        name,
        channelId,
      },
    } as Request;

    const channel = {
      'guild_id': '123123123123123123',
    } as APIChannel;

    const fetchChannelMock = jest.fn();
    fetchChannelMock.mockReturnValueOnce(channel);

    const server = {
      channels: {
        fetch: fetchChannelMock,
      },
      id: guildId,
    } as unknown as APIGuild;

    try {
      await validateRequestBody(req, server);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error).toHaveProperty('message', 'Parameter "channelId" is invalid because its from a different guild');
    }
  });
});
