import { ReactElement, useContext } from 'react';
import Layout from '../../components/Layout';
import {Avatar, Group, SimpleGrid, Space, Title, Text} from '@mantine/core';
import { useParams } from 'react-router-dom';
import useUserServerFromParams from '../../hooks/useUserServerFromParams';
import KibanaButton from '../../components/KibanaButton';
import Loading from '../../components/Loading';
import { BreadCrumpItem } from '../../types';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import voiceActivity from '../../assets/icons/voiceActivity.svg';

export default function EditUserHome(): ReactElement {
  const { user } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));

  if (user.id === '') {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home' },
    { label: `Edit: ${user.name}` },
  ];

  return (
    <Layout navItems={navItems} containerSize={'sm'}>
      <Group align="center">
        <Title>Greetings {user.name}!</Title>
        <Avatar src={user.icon} alt={'Profile icon'} />
      </Group>
      <Text color={'dimmed'}>Here you can edit various of your user settings</Text>
      <Space h={'xl'} />
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 700, cols: 1 },
        ]}
      >
        <KibanaButton
          icon={'/assets/playlist.png'}
          text={'Playlist'}
          subtext={'Edit your Playlists'}
          to={`/user/${user.id}/playlist`}
        />
        <KibanaButton
          icon={voiceActivity}
          text={'Voice activity'}
          subtext={'Show your voice activity'}
          to={`/user/${user.id}/activity`}
        />
      </SimpleGrid>
    </Layout>
  );
}
