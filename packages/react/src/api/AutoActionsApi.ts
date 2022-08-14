import Ajax from './Ajax';

export default class AutoActionsApi {
  public static async loadActions(type: string, serverId: string): Promise<Record<string, never>|string> {
    const body = JSON.stringify({ type });
    const response = await Ajax.post(`/v1/server/${serverId}/auto/get`, body);

    if (response.code !== 200) {
      return response.data.error;
    }

    return JSON.parse(response.data.data);
  }

  public static async saveActions(
    type: string,
    serverId: string,
    payload: string,
  ): Promise<true|string> {
    const body = JSON.stringify({ payload, type });
    const response = await Ajax.post(`/v1/server/${serverId}/auto/save`, body);

    if (response.code !== 200) {
      return response.data.error;
    }

    return true;
  }
}
