import { LoginApiResponseData, LogoutApiResponseData, VerifyApiResponseData } from '@eve/types/api';
import Ajax from './Ajax';

export async function login(code: string): Promise<LoginApiResponseData|string> {
  const body = JSON.stringify({ code });
  const response = await Ajax.post<LoginApiResponseData>('/v1/login/login', body);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}

export async function verify(apiKey: string): Promise<VerifyApiResponseData|string> {
  const response = await Ajax.get<VerifyApiResponseData>('/v1/login/verify', {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}

export async function logout(): Promise<LogoutApiResponseData|string> {
  const response = await Ajax.get<LogoutApiResponseData>('/v1/login/logout', {});

  if (response.error !== null) {
    return response.error;
  }

  return response.data;
}
