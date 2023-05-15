import { Ajax, ApiKey, ForbiddenPage, Layout } from '@eve/panel/feature/core';
import LogsComponent from '@eve/panel/feature/server-logs';
import { BasicServerInfoApiResponseData, BreadCrumpItem, FormattedPublicLogRecord, ReducedServer } from '@eve/types/api';
import { cookies } from 'next/headers';

type ServerHomeProps = {
  params: {
    id: string,
  }
}

export async function generateMetadata({ params }: ServerHomeProps) {
  const server = await getServer(params.id);
  if (!server) {
    return { title: 'Forbidden - EVE' };
  }

  return {
    title: `Logs - ${server.name} - EVE`,
  };
}

export default async function Page({ params }: ServerHomeProps) {
  const server = await getServer(params.id);
  if (!server) {
    return <ForbiddenPage />;
  }

  const initialLogs = await getLogs(params.id);

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: server.name, to: `/server/${server.id}/home` },
    { label: 'Logs' },
  ];

  return (
    <Layout context={server} backTo={`/server/${server.id}/home`} containerSize={'md'} navItems={navItems}>
      <LogsComponent server={server} initialLogs={initialLogs} />
    </Layout>
  );
}

async function getLogs(serverId: string): Promise<FormattedPublicLogRecord[] | never> {
  const apiKey = ApiKey.getApiKey(cookies());
  if (!apiKey) {
    throw new Error('ApiKey not set');
  }

  const response = await Ajax.get<FormattedPublicLogRecord[]>(`/v1/server/${serverId}/logs`, {}, { apiKey });
  if (!response.data) {
    throw new Error(`Failed to fetch server info: ${response.error}`);
  }
  return response.data;
}

async function getServer(serverId: string): Promise<ReducedServer | null | never> {
  const apiKey = ApiKey.getApiKey(cookies());
  if (!apiKey) {
    throw new Error('ApiKey not set');
  }

  const response = await Ajax.get<BasicServerInfoApiResponseData>(`/v1/server/${serverId}/basicInfo`, {}, { apiKey });
  if (response.code === 401) {
    return null;
  } else if (!response.data) {
    throw new Error('Failed to fetch server info: ${response.error}');
  }

  return response.data;
}

