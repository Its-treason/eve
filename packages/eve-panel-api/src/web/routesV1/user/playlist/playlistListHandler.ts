import { Request, Response } from 'express';
import { ResponseHelper } from '../../../ResponseHelper';
import PlaylistProjection from '../../../../projections/PlaylistProjection';
import { PlaylistListApiResponseData } from '../../../sharedApiTypes';

export default async function playlistListHandler(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  
  const response: PlaylistListApiResponseData = await PlaylistProjection.loadPlaylistsOfUser(userId);
  
  ResponseHelper.successResponse(res, response);
}
