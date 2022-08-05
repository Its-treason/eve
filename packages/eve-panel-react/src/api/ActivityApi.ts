import { UserActivityApiResponseData } from './sharedApiTypes';
import Ajax from './Ajax';

export default class ActivityApi {
  public static async getUserActivity(userId: string, start: Date, end: Date, abortController: AbortController): Promise<UserActivityApiResponseData|string> {
    const body = JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() });
    const response = await Ajax.post(`/v1/user/${userId}/activity`, body, abortController);

    if (response.code !== 200) {
      return response.data.error;
    }

    return response.data.data;
  }

  public static async getUserActivityCsv(userId: string, start: Date, end: Date): Promise<string> {
    const body = JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() });
    const response = await Ajax.post(`/v1/user/${userId}/activityCsv`, body);

    if (response.code !== 200) {
      return response.data.error;
    }

    return response.data.data;
  }
}
