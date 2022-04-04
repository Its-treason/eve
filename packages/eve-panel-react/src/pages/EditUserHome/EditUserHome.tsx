import React, { ReactElement, useContext } from 'react';
import Layout from '../../components/Layout';
import {Container, Group, Space, ThemeIcon, Title} from '@mantine/core';
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
    { label: 'Home', to: '/home', active: false },
    { label: `Edit: ${user.name}`, active: true },
  ];

  return (
    <Layout navItems={navItems}>
      <Container size={'xs'}>
        <Group direction="row" align="center">
          <Title>Greetings {user.name}!</Title>
          <ThemeIcon size={'xl'}>
            <img style={{borderRadius: '40%'}} height={36} src={user.icon} alt={'Profile icon'} />
          </ThemeIcon>
        </Group>
        <Space h={'sm'} />
        <KibanaButton
          icon={'/assets/playlist.png'}
          text={'Playlist'}
          subtext={'Edit your Playlists'}
          to={`/user/${user.id}/playlist`}
        />
        <Space h={'sm'} />
        <KibanaButton
          icon={voiceActivity}
          text={'Voice activity'}
          subtext={'Show your voice activity'}
          to={`/user/${user.id}/activity`}
        />
      </Container>
    </Layout>
  );
}
