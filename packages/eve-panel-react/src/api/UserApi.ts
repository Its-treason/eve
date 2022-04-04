import { BasicUserInfoApiResponseData } from './sharedApiTypes';
import Ajax from './Ajax';

export default class UserApi {
  public static async getBasicInfo(userId: string): Promise<BasicUserInfoApiResponseData|false> {
    const response = await Ajax.get(`/v1/user/${userId}/basicInfo`);

    if (response.code !== 200) {
      return false;
    }

    return response.data.data;
  }
}
