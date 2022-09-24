import { BasicUserInfoApiResponseData } from '@eve/types/api';
import Ajax from './Ajax';

export async function getBasicUserInfo(userId: string, apiKey: string): Promise<BasicUserInfoApiResponseData|string> {
  const response = await Ajax.get<BasicUserInfoApiResponseData>(`/v1/user/${userId}/basicInfo`, {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}
