import { getAllPlaylists, getBasicUserInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import PlaylistHome from '@eve/panel/feature/playlist';
import { BreadCrumpItem, ReducedUser } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

type PlaylistProps = {
  user: ReducedUser,
  initialPlaylists: string[],
  showInvalidPlaylistError: boolean,
}

export function Playlist({ user, initialPlaylists, showInvalidPlaylistError }: PlaylistProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: user.name, to: `/user/${user.id}/home` },
    { label: 'Playlist' },
  ];

  return (
    <Layout context={user} backTo={`/user/${user.id}/home`} containerSize={'xs'} navItems={navItems}>
      <Head><title>{`Playlists - ${user.name} - EVE`}</title></Head>
      <PlaylistHome
        user={user}
        initialPlaylists={initialPlaylists}
        showInvalidPlaylistError={showInvalidPlaylistError}
      />
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

  const playlistsRes = await getAllPlaylists(user.id, apiKey);
  let initialPlaylists: string[] = [];
  if (playlistsRes !== false) {
    initialPlaylists = playlistsRes;
  }

  const showInvalidPlaylistError = context.query.invalidName !== undefined;

  return { props: { user, initialPlaylists, showInvalidPlaylistError } };
}

export default Playlist;
