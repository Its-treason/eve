import { Ajax, ApiKey, ForbiddenPage, Layout } from '@eve/panel/feature/core';
import { BasicUserInfoApiResponseData, BreadCrumpItem, PlaylistListApiResponseData, ReducedUser } from '@eve/types/api';
import { cookies } from 'next/headers';
import EditPlaylistPage from '@eve/panel/feature/playlist-edit';
import { redirect } from 'next/navigation';

type EditPlaylistProps = {
  params: {
    id: string,
    name: string,
  }
}

export async function generateMetadata({ params }: EditPlaylistProps) {
  const user = await getUser(params.id);
  if (!user) {
    return { title: 'Forbidden - EVE' };
  }

  return {
    title: `${params.name} - Playlist - ${user.name} - EVE`,
  };
}

export default async function Page({ params }: EditPlaylistProps) {
  const user = await getUser(params.id);
  if (!user) {
    return <ForbiddenPage />;
  }

  const allPlaylists = await getAllPlaylists(params.id);
  if (!allPlaylists.includes(params.name)) {
    redirect(`/user/${user.id}/playlist?invalidName=true`);
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: user.name, to: `/user/${user.id}/home` },
    { label: 'Playlist', to: `/user/${user.id}/playlist` },
    { label: params.name },
  ];

  return (
    <Layout context={user} backTo={`/user/${user.id}/playlist`} containerSize={'md'} navItems={navItems}>
      <EditPlaylistPage
        user={user}
        playlistName={params.name}
      />
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
