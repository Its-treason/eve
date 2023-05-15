import { UserActivity } from '@eve/panel/feature/activity';
import { Ajax, ApiKey, ForbiddenPage, Layout } from '@eve/panel/feature/core';
import { BasicUserInfoApiResponseData, BreadCrumpItem, ReducedUser } from '@eve/types/api';
import { cookies } from 'next/headers';

type UserActivityProps = {
  params: {
    id: string,
  }
}

export async function generateMetadata({ params }: UserActivityProps) {
  const user = await getUser(params.id);
  if (!user) {
    return { title: 'Forbidden - EVE' };
  }

  return {
    title: `Voice activity - ${user.name} - EVE`,
  };
}

export default async function Page({ params }: UserActivityProps) {
  const user = await getUser(params.id);
  if (!user) {
    return <ForbiddenPage />;
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: user.name, to: `/user/${user.id}/home` },
    { label: 'Voice activity' },
  ];

  return (
    <Layout context={user} backTo={`/user/${user.id}/home`} containerSize={'md'} navItems={navItems}>
      <UserActivity user={user} />
    </Layout>
  );
}

async function getUser(userId: string): Promise<ReducedUser | null | never> {
  const apiKey = ApiKey.getApiKey(cookies());
  if (!apiKey) {
    throw new Error('ApiKey not set');
  }

  const response = await Ajax.get<BasicUserInfoApiResponseData>(`/v1/user/${userId}/basicInfo`, {}, { apiKey });
  if (response.code === 401) {
    return null;
  } else if (response.code !== 200) {
    throw new Error(`Failed to fetch invite link: ${response.error}`);
  }

  return response.data;
}
