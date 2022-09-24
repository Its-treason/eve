import { Layout, verify } from '@eve/panel/feature/core';
import { deleteCookie, getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next/types';
import LoginFirstComponent from '@eve/panel/feature/login-first';
import Head from 'next/head';

type LoginFirstProps = {
  error?: string,
}

export function LoginFirst({ error }: LoginFirstProps) {
  return (
    <Layout showLogoutBtn={false}>
      <Head><title>Login - EVE</title></Head>
      <LoginFirstComponent error={error} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let error = null;
  if (typeof context.query.error === 'string') {
    error = context.query.error;
  }

  const apiKey = getCookie('apiKey', context);
  if (typeof apiKey !== 'string') {
    deleteCookie('apiKey', context);
    return { props: { error } };
  }

  const verifyResponse = verify(apiKey);
  if (typeof verifyResponse === 'string') {
    deleteCookie('apiKey', context);
    return { props: { error } };
  }

  // We are already logged in so redirect to home
  return {
    redirect: {
      statusCode: 302,
      destination: '/',
    }
  }
}

export default LoginFirst;
