import { Request, Response } from 'express';
import YtResultService from '../../../../../music/YtResultService';
import { ResponseHelper } from '../../../../ResponseHelper';
import { SearchApiRequestData, SearchApiResponseData } from '../../../../sharedApiTypes';
import PlayQuery from '../../../../../value/PlayQuery';

export default async function searchHandler(req: Request, res: Response): Promise<void> {
  const { query } = (req.body as SearchApiRequestData);
  const { userId } = req.params;

  const playQuery = PlayQuery.fromQuery(query);
  const playlistItems = await YtResultService.parseQuery(playQuery, userId);
  const response: SearchApiResponseData = {
    playlistItems,
    allChecked: playQuery.getType() !== 'search',
  };
  ResponseHelper.successResponse(res, response);
}
