import { Request, Response } from 'express';
import { ResponseHelper } from '../../../ResponseHelper';
import PlaylistProjection from '../../../../projections/PlaylistProjection';
import { PlaylistViewApiRequestData, PlaylistViewApiResponseData } from '../../../sharedApiTypes';

export default async function playlistViewHandler(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const { name } = (req.body as PlaylistViewApiRequestData);

  const result = await PlaylistProjection.loadPlaylistByNameAndUserId(name, userId);
  if (result === false) {
    ResponseHelper.userErrorResponse(res, 'Invalid Playlist name');
    return;
  }

  const response: PlaylistViewApiResponseData = result;
  ResponseHelper.successResponse(res, response);
}
