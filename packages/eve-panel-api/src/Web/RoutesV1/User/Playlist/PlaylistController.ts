import { PlaylistRepository } from 'eve-core';
import { Request } from 'express';
import { singleton } from 'tsyringe';
import { ResponseWithLocals } from '../../../../types';
import AbstractController from '../../../AbstractController';
import { PlaylistListApiResponseData, PlaylistViewApiResponseData } from '../../../sharedApiTypes';
import PlaylistBodyValidator from './PlaylistBodyValidator';

@singleton()
export default class PlaylistController extends AbstractController {
  constructor(
    private bodyValidator: PlaylistBodyValidator,
    private playlistRepository: PlaylistRepository,
  ) {
    super();
  }

  public async listPlaylists(req: Request, res: ResponseWithLocals) {
    const { userId } = req.params;

    const response: PlaylistListApiResponseData = await this.playlistRepository.loadPlaylistsOfUser(userId);

    this.successResponse(res, response);
  }

  public async viewPlaylist(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validatePlaylistViewBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }
    const { userId } = req.params;
    const { name } = validationResult.data;

    const result = await this.playlistRepository.loadPlaylistByNameAndUserId(name, userId);
    if (result === false) {
      this.userErrorResponse(res, 'Invalid Playlist name');
      return;
    }

    const response: PlaylistViewApiResponseData = result;
    this.successResponse(res, response);
  }

  public async savePlaylist(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validatePlaylistSaveBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { userId } = req.params;
    const { name, playlistItems } = validationResult.data;

    await this.playlistRepository.savePlaylist(name, userId, playlistItems);

    this.successResponse(res, { acknowledged: true });
  }

  public async deletePlaylist(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validatePlaylistDeleteBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { userId } = req.params;
    const { name } = validationResult.data;

    await this.playlistRepository.deletePlaylist(name, userId);

    this.successResponse(res, { acknowledged: true });
  }
}
