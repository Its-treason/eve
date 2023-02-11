import { Layout, Loading, login } from '@eve/panel/feature/core';
import { setCookie } from 'cookies-next';
import Head from 'next/head';
import { GetServerSideProps } from 'next/types';

export function DoLogin() {
  return (
    <Layout showLogoutBtn={false}>
      <Head><title>Logging in... - EVE</title></Head>
      <Loading />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.query.code;
  if (typeof code !== 'string') {
    const urlParams = new URLSearchParams({ error: 'Parameter "code" missing' });
    return {
      redirect: {
        statusCode: 302,
        destination: `/loginFirst?${urlParams.toString()}`,
      },
    };
  }

  const response = await login(code);
  if (typeof response === 'string') {
    const urlParams = new URLSearchParams({ error: response });
    return {
      redirect: {
        statusCode: 302,
        destination: `/loginFirst?${urlParams.toString()}`,
      },
    };
  }

  setCookie('apiKey', response.apiKey, context);

  return {
    redirect: {
      statusCode: 302,
      destination: '/',
    },
  };
};

export default DoLogin;
