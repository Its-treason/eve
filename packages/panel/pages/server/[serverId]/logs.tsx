import { getBasicServerInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import { BreadCrumpItem, FormattedPublicLogRecord, ReducedServer } from '@eve/types/api';
import LogsComponent from 'packages/panel/feature/server-logs/src'
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getAllLogs } from 'packages/panel/feature/core/src/api/LogsApi';

type LogsProps = {
  server: ReducedServer,
  initialLogs: FormattedPublicLogRecord[],
}

export function Logs({ server, initialLogs }: LogsProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: server.name, to: `/server/${server.id}/home` },
    { label: 'Logs' },
  ];

  return (
    <Layout context={server} backTo={`/server/${server.id}/home`} containerSize={'md'} navItems={navItems}>
        <Head><title>{`Logs - ${server.name} - EVE`}</title></Head>
        <LogsComponent server={server} initialLogs={initialLogs} />
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

  const initialLogs = await getAllLogs(server.id, apiKey);

  if (typeof initialLogs === 'string') {
    return { redirect: { statusCode: 302, destination: '/loginFirst' } };
  }

  return { props: { server, initialLogs } };
}

export default Logs;
