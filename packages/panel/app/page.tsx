import { Ajax, ApiKey } from '@eve/panel/feature/core';
import { Layout } from '@eve/panel/feature/core';
import { InviteApiResponseData, ReducedUser, VerifyApiResponseData } from '@eve/types/api';
import HomeComponent from '@eve/panel/feature/home';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Home - EVE',
};

export default async function Page() {
  const { user, inviteLink } = await getData();

  return (
    <Layout containerSize={'md'} context={user}>
      <HomeComponent user={user} inviteLink={inviteLink} />
    </Layout>
  );
}

async function getData() {
  const apiKey = ApiKey.getApiKey(cookies());
  if (!apiKey) {
    throw new Error('ApiKey not set');
  }

  const [user, inviteLink] = await Promise.all([getUser(apiKey), getInviteLink(apiKey)]);

  return { user, inviteLink };
}

async function getUser(apiKey: string): Promise<ReducedUser | never> {
  const response = await Ajax.get<VerifyApiResponseData>('/v1/login/verify', {}, { apiKey });
  if (response.data === null) {
    throw new Error(`Failed to fetch invite link: ${response.error}`);
  }

  return response.data;
}

async function getInviteLink(apiKey: string): Promise<string | never> {
  const response = await Ajax.get<InviteApiResponseData>('/v1/invite', {}, { apiKey });
  if (response.data === null) {
    throw new Error(`Failed to fetch invite link: ${response.error}`);
  }

  return response.data.invite;
}
