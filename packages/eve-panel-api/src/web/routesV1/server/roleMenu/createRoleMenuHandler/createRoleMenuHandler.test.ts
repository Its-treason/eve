import * as validateRequestBody from './validateRequestBody';
import RoleMenuProjection from '../../../../../projections/RoleMenuProjection';
import { ResponseHelper } from '../../../../ResponseHelper';
import createRoleMenuHandler from './createRoleMenuHandler';
import { Request, Response } from 'express';
import { APIChannel, APIGuild } from 'discord-api-types/v9';

describe('Can create role menus', () => {
  it('Can save a role menu', async () => {
    const serverId = '123123123123123123';
    const channelId = '223123123123123123';
    const name = 'hjklhkljhllhjkhkjlhkjlhkjljhkhklhklhkjkl';
    const channel = { id: channelId } as APIChannel;

    const server = { id: serverId } as APIGuild;

    const req = { name, channelId } as unknown as Request;

    const res = {
      locals: {
        server,
      },
    } as unknown as Response;

    const validateBodyMock = jest.spyOn(validateRequestBody, 'default');

    const params = {
      name,
      channel,
    };

    validateBodyMock.mockImplementation(async () => params);

    const saveEntryMock = jest.spyOn(RoleMenuProjection, 'saveEntry');
    saveEntryMock.mockImplementation(async () => undefined);

    const successResponseMock = jest.spyOn(ResponseHelper, 'successResponse');
    successResponseMock.mockImplementation(async () => undefined);

    await createRoleMenuHandler(req, res);

    expect(validateBodyMock.mock.calls.length).toBe(1);
    expect(validateBodyMock.mock.calls[0][0]).toBe(req);
    expect(validateBodyMock.mock.calls[0][1]).toBe(server);

    expect(saveEntryMock.mock.calls.length).toBe(1);
    expect(saveEntryMock.mock.calls[0][1]).toBe(serverId);
    expect(saveEntryMock.mock.calls[0][2]).toBe(channelId);
    expect(saveEntryMock.mock.calls[0][3]).toBe('');
    expect(saveEntryMock.mock.calls[0][4]).toStrictEqual([]);
    expect(saveEntryMock.mock.calls[0][5]).toBe('');
    expect(saveEntryMock.mock.calls[0][6]).toBe(name);

    expect(successResponseMock.mock.calls.length).toBe(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(res);
    expect(successResponseMock.mock.calls[0][1]).toStrictEqual({ acknowledged: true });
  });
});
