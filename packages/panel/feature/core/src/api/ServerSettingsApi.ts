import Ajax from './Ajax';

export async function loadSetting(
  type: string,
  serverId: string,
  apiKey: string,
  abortController: AbortController,
): Promise<Record<string, unknown>|string> {
  const body = JSON.stringify({ type });
  const response = await Ajax.post<Record<string, unknown>>(`/v1/server/${serverId}/auto/get`, body, apiKey, abortController);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}

export async function saveSetting(
  type: string,
  serverId: string,
  payload: Record<string, unknown>,
  apiKey: string,
): Promise<true|string> {
  const body = JSON.stringify({ payload, type });
  const response = await Ajax.post(`/v1/server/${serverId}/auto/save`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}
