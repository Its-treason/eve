import { Request, Response } from 'express';
import { ResponseHelper } from '../../../ResponseHelper';
import PlaylistProjection from '../../../../projections/PlaylistProjection';
import {
  PlaylistDeleteApiRequestData,
  PlaylistDeleteApiResponseData,
} from '../../../sharedApiTypes';

export default async function playlistDeleteHandler(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  const { name } = (req.body as PlaylistDeleteApiRequestData);

  await PlaylistProjection.deletePlaylist(name, userId);

  const response: PlaylistDeleteApiResponseData = { deleted: true };

  ResponseHelper.successResponse(res, response);
}
