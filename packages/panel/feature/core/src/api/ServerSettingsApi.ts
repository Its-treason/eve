import Ajax from './Ajax';

export async function loadSetting(
  type: string,
  serverId: string,
  apiKey: string,
  abortController: AbortController,
): Promise<Record<string, unknown>|string> {
  const body = { type };
  const response = await Ajax.get<Record<string, unknown>>(`/v1/server/${serverId}/setting`, body, apiKey, abortController);

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
  const response = await Ajax.put(`/v1/server/${serverId}/setting`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return true;
}
