import { getBasicUserInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import UserHome from '@eve/panel/feature/user-home';
import { BreadCrumpItem, ReducedUser } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

type HomeProps = {
  user: ReducedUser,
}

export function Home({ user }: HomeProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: user.name },
  ];

  return (
    <Layout context={user} backTo={'/'} containerSize={'md'} navItems={navItems}>
      <Head><title>{user.name} - EVE</title></Head>
      <UserHome user={user} />
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

export default Home;
