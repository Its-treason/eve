import { ReducedUser } from '@eve/types/api';
import { deleteCookie, getCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next/types';
import { verify } from '../api/LoginApi';

type VerifiedData = {
  apiKey: string,
  user: ReducedUser,
}

export async function verifyApiKey(context: GetServerSidePropsContext): Promise<VerifiedData|string> {
  const apiKey = getCookie('apiKey', context);
  if (typeof apiKey !== 'string') {
    deleteCookie('apiKey', context);
    return 'You must login before accessing EVE\'s control panel';
  }

  const verifyResponse = await verify(apiKey);
  if (typeof verifyResponse === 'string') {
    deleteCookie('apiKey', context);
    return 'You\'re session has expired, please login again';
  }

  return { user: verifyResponse, apiKey };
}
