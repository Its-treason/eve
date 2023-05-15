import { Ajax, ApiKey, ForbiddenPage, Layout } from '@eve/panel/feature/core';
import PlaylistHome from '@eve/panel/feature/playlist';
import { BasicUserInfoApiResponseData, BreadCrumpItem, PlaylistListApiResponseData, ReducedUser } from '@eve/types/api';
import { cookies } from 'next/headers';

type PlaylistProps = {
  params: {
    id: string,
  }
}

export async function generateMetadata({ params }: PlaylistProps) {
  const user = await getUser(params.id);
  if (!user) {
    return { title: 'Forbidden - EVE' };
  }

  return {
    title: `Playlists - ${user.name} - EVE`,
  };
}

export default async function Page({ params }: PlaylistProps) {
  const user = await getUser(params.id);
  if (!user) {
    return <ForbiddenPage />;
  }

  const initialPlaylists = await getAllPlaylists(user.id);

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: user.name, to: `/user/${user.id}/home` },
    { label: 'Playlist' },
  ];

  return (
    <Layout context={user} backTo={`/user/${user.id}/home`} containerSize={'xs'} navItems={navItems}>
      <PlaylistHome
        user={user}
        initialPlaylists={initialPlaylists}
      />
    </Layout>
  );
}

async function getAllPlaylists(userId: string): Promise<string[] | never> {
  const apiKey = ApiKey.getApiKey(cookies());
  if (!apiKey) {
    throw new Error('ApiKey not set');
  }

  const response = await Ajax.get<PlaylistListApiResponseData>(`/v1/user/${userId}/playlist/list`, {}, { apiKey });
  if (!response.data) {
    throw new Error(`Failed to fetch all playlists: ${response.error}`);
  }
  return response.data;
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
