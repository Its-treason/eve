import { InviteApiResponseData } from '@eve/types/api';
import Ajax from './Ajax';

export async function createInvite(apiKey: string): Promise<InviteApiResponseData|string> {
  const response = await Ajax.get<InviteApiResponseData>('/v1/invite', {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}
