import { Request, Response } from 'express';
import { ResponseHelper } from '../../../ResponseHelper';
import PlaylistProjection from '../../../../projections/PlaylistProjection';
import { PlaylistSaveApiRequestData, PlaylistSaveApiResponseData } from '../../../sharedApiTypes';

export default async function playlistSaveHandler(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  const { name, playlistItems } = (req.body as PlaylistSaveApiRequestData);

  await PlaylistProjection.savePlaylist(name, userId, playlistItems);

  const response: PlaylistSaveApiResponseData = { saved: true };

  ResponseHelper.successResponse(res, response);
}
