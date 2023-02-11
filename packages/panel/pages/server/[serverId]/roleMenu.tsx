import { RoleMenu } from '@eve/core';
import { getAllRoleMenus, getBasicServerInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import RoleMenuComponent from '@eve/panel/feature/role-menu';
import { BreadCrumpItem, ReducedServer } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

type RoleMenuProps = {
  server: ReducedServer,
  initialRoleMenus: RoleMenu[],
}

export function RoleMenu({ server, initialRoleMenus }: RoleMenuProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: server.name, to: `/server/${server.id}/home` },
    { label: 'Role menu' },
  ];

  return (
    <Layout context={server} backTo={`/server/${server.id}/home`} containerSize={'md'} navItems={navItems}>
        <Head><title>{`Role menu - ${server.name} - EVE`}</title></Head>
        <RoleMenuComponent server={server} initialRoleMenus={initialRoleMenus} />
    </Layout>
  );
}

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

  const initialRoleMenus = await getAllRoleMenus(server.id, apiKey);
  if (typeof initialRoleMenus === 'string') {
    return { redirect: { statusCode: 302, destination: '/loginFirst' } };
  }

  return { props: { server, initialRoleMenus } };
};

export default RoleMenu;
