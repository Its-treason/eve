import { Ajax } from '@eve/panel/feature/core';
import { LoginApiResponseData } from '@eve/types/api';
import { redirect } from 'next/navigation';
import LoginSuccess from './LoginSuccess';

type DoLoginProps = {
  searchParams: {
    code?: string,
  }
}

export const metadata = {
  title: 'Login - EVE',
};

export default async function DoLogin({ searchParams }: DoLoginProps) {
  if (!searchParams.code) {
    redirect('/loginFirst');
  }

  const apiKey = await login(searchParams.code);

  return <LoginSuccess apiKey={apiKey} />;
}

async function login(code: string): Promise<string|never> {
  const body = JSON.stringify({ code });
  const response = await Ajax.post<LoginApiResponseData>('/v1/login/login', body);
  if (response.data === null) {
    redirect('/loginFirst');
  }

  return response.data.apiKey;
}
