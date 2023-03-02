import { getAllPlaylists, getBasicUserInfo, Layout, verifyApiKey } from '@eve/panel/feature/core';
import EditPlaylistPage from '@eve/panel/feature/playlist-edit';
import { BreadCrumpItem, ReducedUser } from '@eve/types/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

type EditPlaylistProps = {
  user: ReducedUser,
  playlistName: string,
}

export function EditPlaylist({ user, playlistName }: EditPlaylistProps) {
  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/' },
    { label: user.name, to: `/user/${user.id}/home` },
    { label: 'Playlist', to: `/user/${user.id}/playlist` },
    { label: playlistName },
  ];

  return (
    <Layout context={user} backTo={`/user/${user.id}/playlist`} containerSize={'md'} navItems={navItems}>
      <Head><title>{`Playlist ${playlistName} - ${user.name} - EVE`}</title></Head>
      <EditPlaylistPage
        user={user}
        playlistName={playlistName}
      />
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

  const user = await getBasicUserInfo(String(context.query.userId), apiKey);
  if (typeof user === 'string') {
    return { redirect: { statusCode: 302, destination: '/loginFirst' } };
  }

  const playlistsRes = await getAllPlaylists(user.id, apiKey);
  let allPlaylists: string[] = [];
  if (playlistsRes !== false) {
    allPlaylists = playlistsRes;
  }

  const playlistName = context.query.playlistName;
  if (typeof playlistName !== 'string' || !allPlaylists.includes(playlistName)) {
    return { redirect: { statusCode: 302, destination: `/user/${user.id}/playlist?invalidName=true` } };
  }

  return { props: { user, playlistName } };
};

export default EditPlaylist;
