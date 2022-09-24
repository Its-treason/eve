import { ActivityRow, UserActivityApiResponseData } from '@eve/types/api';
import Ajax from './Ajax';

export async function getUserActivity(
  userId: string,
  start: Date,
  end: Date,
  apiKey: string,
  abortController: AbortController,
): Promise<UserActivityApiResponseData|string> {
  const body = JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() });
  const response = await Ajax.post<UserActivityApiResponseData>(`/v1/user/${userId}/activity`, body, apiKey, abortController);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}

export async function getUserActivityCsv(
  userId: string,
  start: Date,
  end: Date,
  apiKey: string,
): Promise<string> {
  const body = JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() });
  const response = await Ajax.post<string>(`/v1/user/${userId}/activityCsv`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}

export async function getServerActivity(
  serverId: string,
  startDate: Date,
  endDate: Date,
  apiKey: string,
  abortController: AbortController,
): Promise<ActivityRow[]|string> {
  const body = JSON.stringify({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
  const response = await Ajax.post<ActivityRow[]>(`/v1/server/${serverId}/activity`, body, apiKey, abortController);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}

export async function getServerActivityCsv(
  serverId: string,
  start: Date,
  end: Date,
  apiKey: string,
): Promise<string> {
  const body = JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() });
  const response = await Ajax.post<string>(`/v1/user/${serverId}/activityCsv`, body, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}
