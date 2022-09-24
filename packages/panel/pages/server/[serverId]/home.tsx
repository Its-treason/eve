import { getBasicServerInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import ServerHome from '@eve/panel/feature/server-home';
import { BreadCrumpItem, ReducedServer } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

type HomeProps = {
  server: ReducedServer,
}

export function Home({ server }: HomeProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: server.name },
  ];

  return (
    <Layout context={server} backTo={'/'} containerSize={'md'} navItems={navItems}>
      <Head><title>{server.name} - EVE</title></Head>
      <ServerHome server={server} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const verifyResponse = await verifyApiKey(context);
  if (typeof verifyResponse === 'string') {
    return { 
      redirect: { 
        statusCode: 302,
        destination: `/loginFirst?error=${encodeURIComponent(verifyResponse)}`,
      },
    };
  }

  const { apiKey } = verifyResponse;

  const server = await getBasicServerInfo(String(context.query.serverId), apiKey);
  if (typeof server === 'string') {
    return { redirect: { statusCode: 302, destination: '/loginFirst' } };
  }

  return { props: { server } };
}

export default Home;
