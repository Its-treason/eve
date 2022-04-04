import { Request, Response } from 'express';
import PlayQuery from '../../../../../value/PlayQuery';
import { ResponseHelper } from '../../../../ResponseHelper';
import YtResultService from '../../../../../music/YtResultService';
import PlaylistProjection from '../../../../../projections/PlaylistProjection';
import { PlaylistItem, SpotifyImportApiRequestData, SpotifyImportApiResponseData } from '../../../../sharedApiTypes';

export default async function importSpotifyPlaylistHandler(req: Request, res: Response): Promise<void> {
  const { query, name } = (req.body as SpotifyImportApiRequestData);
  const { userId } = req.params;

  const parsedQuery = PlayQuery.fromQuery(query);
  if (parsedQuery.getType() !== 'spotify-playlist') {
    ResponseHelper.userErrorResponse(res, 'Invalid Query! Type is not `spotify-playlist`!');
    return;
  }

  const response: SpotifyImportApiResponseData = { acknowledge: true };
  ResponseHelper.successResponse(res, response);
  res.end();

  const playQuery = PlayQuery.fromQuery(query);
  const newItems = await YtResultService.parseQuery(playQuery, userId);

  let oldItems = await PlaylistProjection.loadPlaylistByNameAndUserId(name, userId);
  if (oldItems === false) {
    oldItems = [];
  }

  const playlistItems: PlaylistItem[] = [];
  playlistItems.push(...oldItems);
  playlistItems.push(...newItems);
  
  await PlaylistProjection.savePlaylist(name, userId, playlistItems);
}
