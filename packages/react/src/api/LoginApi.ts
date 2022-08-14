import Ajax from './Ajax';
import { LoginApiResponseData, VerifyApiResponseData } from './sharedApiTypes';

export default class LoginApi {
  public static async login(code: string): Promise<LoginApiResponseData|false> {
    const body = JSON.stringify({ code });
    const response = await Ajax.post('/v1/login/login', body);

    if (response.code !== 200) {
      return false;
    }

    return response.data.data;
  }

  public static async verify(): Promise<VerifyApiResponseData|false> {
    const response = await Ajax.get('/v1/login/verify');

    if (response.code !== 200) {
      return false;
    }

    return response.data.data;
  }

  public static async logout(): Promise<VerifyApiResponseData|false> {
    const response = await Ajax.get('/v1/login/logout');

    if (response.code !== 200) {
      return false;
    }

    return response.data.data;
  }
}
