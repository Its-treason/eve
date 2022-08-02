import { PlaylistItem, PlaylistRepository } from 'eve-core';
import { Request } from 'express';
import { singleton } from 'tsyringe';
import YtResultService from '../../../../../Music/YtResultService';
import getSpotifyApi from '../../../../../Structures/getSpotifyApi';
import { ResponseWithLocals } from '../../../../../types';
import PlayQuery from '../../../../../Value/PlayQuery';
import AbstractController from '../../../../AbstractController';
import { SearchApiResponseData, SpotifyPreviewApiResponseData } from '../../../../sharedApiTypes';
import MusicSearchBodyValidator from './MusicSearchBodyValidator';

@singleton()
export default class MusicSearchController extends AbstractController {
  constructor(
    private bodyValidator: MusicSearchBodyValidator,
    private ytResultService: YtResultService,
    private playlistRepository: PlaylistRepository,
  ) {
    super();
  }

  async search(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validateSearchBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { userId } = req.params;
    const { query } = validationResult.data;

    const playQuery = PlayQuery.fromQuery(query);
    const playlistItems = await this.ytResultService.parseQuery(playQuery, userId);
    const response: SearchApiResponseData = {
      playlistItems,
      allChecked: playQuery.getType() !== 'search',
    };
    this.successResponse(res, response);
  }

  async createSpotifyPreview(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validateSpotifyPreviewBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const parsedQuery = PlayQuery.fromQuery(validationResult.data.query);

    const spotifyApi = await getSpotifyApi();
    const result = await spotifyApi.getPlaylist(parsedQuery.getQuery());
    const listResult = await spotifyApi.getPlaylistTracks(parsedQuery.getQuery());
  
    const response: SpotifyPreviewApiResponseData = {
      name: result.body.name,
      description: result.body.description || '',
      owner: result.body.owner.display_name || 'Unknown',
      count: listResult.body.total,
    };
    this.successResponse(res, response);
  }

  async importSpotifyPlaylist(req: Request, res: ResponseWithLocals) {
    const validationResult = await this.bodyValidator.validateSpotifyImportBody(req);
    if (!validationResult.success) {
      this.userErrorResponse(res, 'Body validation failed', validationResult.error.issues);
      return;
    }

    const { userId } = req.params;
    const { query, name } = validationResult.data;

    const parsedQuery = PlayQuery.fromQuery(query);
    if (parsedQuery.getType() !== 'spotify-playlist') {
      this.userErrorResponse(res, 'Invalid Query! Type is not `spotify-playlist`!');
      return;
    }

    this.successResponse(res, { acknowledge: true });
    res.end();

    const playQuery = PlayQuery.fromQuery(query);
    const newItems = await this.ytResultService.parseQuery(playQuery, userId);

    let oldItems = await this.playlistRepository.loadPlaylistByNameAndUserId(name, userId);
    if (oldItems === false) {
      oldItems = [];
    }

    const playlistItems: PlaylistItem[] = [];
    playlistItems.push(...oldItems);
    playlistItems.push(...newItems);
    
    await this.playlistRepository.savePlaylist(name, userId, playlistItems);
  }
}
