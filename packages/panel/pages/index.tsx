import { createInvite, Layout, verifyApiKey } from '@eve/panel/feature/core';
import { ReducedUser } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import HomeComponent from '@eve/panel/feature/home';
import Head from 'next/head';

type IndexProps = {
  user: ReducedUser,
  inviteLink: string,
}

export function Index({ user, inviteLink }: IndexProps) {
  return (
    <Layout containerSize={'md'}>
      <Head><title>Home - EVE</title></Head>
      <HomeComponent user={user} inviteLink={inviteLink} />
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

  const { user, apiKey } = verifyResponse;

  const inviteLinkResponse = await createInvite(apiKey);
  if (typeof inviteLinkResponse === 'string') {
    throw new Error(inviteLinkResponse);
  }

  return { props: { user, inviteLink: inviteLinkResponse.invite } };
};

export default Index;
