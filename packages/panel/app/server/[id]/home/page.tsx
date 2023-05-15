import { Ajax, ApiKey, ForbiddenPage } from '@eve/panel/feature/core';
import { Layout } from '@eve/panel/feature/core';
import { BasicServerInfoApiResponseData, BreadCrumpItem, ReducedServer } from '@eve/types/api';
import { cookies } from 'next/headers';
import ServerHome from '@eve/panel/feature/server-home';

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
    title: `Home - ${server.name} - EVE`,
  };
}

export default async function Page({ params }: ServerHomeProps) {
  const server = await getServer(params.id);
  if (!server) {
    return <ForbiddenPage />;
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: server.name },
  ];

  return (
    <Layout context={server} backTo={'/'} containerSize={'md'} navItems={navItems}>
      <ServerHome server={server} />
    </Layout>
  );
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

