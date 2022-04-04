import { Request, Response } from 'express';
import PlayQuery from '../../../../../value/PlayQuery';
import { ResponseHelper } from '../../../../ResponseHelper';
import getSpotifyApi from '../../../../../structures/getSpotifyApi';
import { SpotifyPreviewApiRequestData, SpotifyPreviewApiResponseData } from '../../../../sharedApiTypes';

export default async function spotifyPreviewHandler(req: Request, res: Response): Promise<void> {
  const { query } = (req.body as SpotifyPreviewApiRequestData);

  const parsedQuery = PlayQuery.fromQuery(query);
  if (parsedQuery.getType() !== 'spotify-playlist') {
    ResponseHelper.userErrorResponse(res, 'Invalid Query! Type is not `spotify-playlist`!');
    return;
  }

  const spotifyApi = await getSpotifyApi();
  const result = await spotifyApi.getPlaylist(parsedQuery.getQuery());
  const listResult = await spotifyApi.getPlaylistTracks(parsedQuery.getQuery());

  const response: SpotifyPreviewApiResponseData = {
    name: result.body.name,
    description: result.body.description || '',
    owner: result.body.owner.display_name || 'Unknown',
    count: listResult.body.total,
  };
  ResponseHelper.successResponse(res, response);
}
