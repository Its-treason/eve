import { getBasicUserInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import { BreadCrumpItem, ReducedUser } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { UserActivity } from '@eve/panel/feature/activity';

type ActivityProps = {
  user: ReducedUser,
}

export function Activity({ user }: ActivityProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: user.name, to: `/user/${user.id}/home` },
    { label: 'Voice activity' },
  ];

  return (
    <Layout context={user} backTo={`/user/${user.id}/home`} containerSize={'md'} navItems={navItems}>
      <Head><title>{user.name} - EVE</title></Head>
      <UserActivity user={user} />
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

  const user = await getBasicUserInfo(String(context.query.userId), apiKey);
  if (typeof user === 'string') {
    return { redirect: { statusCode: 302, destination: '/loginFirst' } };
  }

  return { props: { user } };
}

export default Activity;
