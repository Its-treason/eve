import AutoActions from '@eve/panel/feature/auto-actions';
import { getBasicServerInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import { BreadCrumpItem, ReducedServer } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

type ActionsProps = {
  server: ReducedServer,
}

export function Actions({ server }: ActionsProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: server.name, to: `/server/${server.id}/home` },
    { label: `Auto Actions` },
  ];

  return (
    <Layout context={server} backTo={`/server/${server.id}/home`} containerSize={'md'} navItems={navItems}>
        <Head><title>{`Auto actions - ${server.name} - EVE`}</title></Head>
        <AutoActions server={server} />
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

export default Actions;
