import { InviteApiResponseData } from './sharedApiTypes';
import Ajax from './Ajax';

export default class GeneralApi {
  public static async createInvite(): Promise<InviteApiResponseData|false> {
    const response = await Ajax.get('/v1/invite');

    if (response.code !== 200) {
      return false;
    }

    return response.data.data;
  }
}
