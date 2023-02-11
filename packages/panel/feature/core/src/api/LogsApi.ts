import { FormattedPublicLogRecord } from '@eve/types/api';
import Ajax from './Ajax';

export async function getAllLogs(
  serverId: string,
  apiKey: string,
): Promise<FormattedPublicLogRecord[]|string> {
  const response = await Ajax.get<FormattedPublicLogRecord[]>(`/v1/server/${serverId}/logs`, {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}
