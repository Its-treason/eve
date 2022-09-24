import Ajax from './Ajax';

export async function loadActions(type: string, serverId: string, apiKey: string): Promise<Record<string, never>|string> {
  const body = JSON.stringify({ type });
  const response = await Ajax.post<string>(`/v1/server/${serverId}/auto/get`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  // This endpoint return the auto action as an json encoded, this is stupid
  return JSON.parse(response.data);
}

export async function saveActions(
  type: string,
  serverId: string,
  payload: string,
  apiKey: string,
): Promise<true|string> {
  const body = JSON.stringify({ payload, type });
  const response = await Ajax.post(`/v1/server/${serverId}/auto/save`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}
