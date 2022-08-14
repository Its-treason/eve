import { ReactElement, useContext } from 'react';
import Layout from '../../components/Layout';
import {Space, Title, Text, Group, Avatar, SimpleGrid} from '@mantine/core';
import { useParams } from 'react-router-dom';
import useUserServerFromParams from '../../hooks/useUserServerFromParams';
import KibanaButton from '../../components/KibanaButton';
import Loading from '../../components/Loading';
import { BreadCrumpItem } from '../../types';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import autoIcon from '../../assets/icons/auto.svg';
import roleMenuIcon from '../../assets/icons/role_menu.svg';
import voiceActivity from '../../assets/icons/voiceActivity.svg';

export default function EditServerHome(): ReactElement {
  const { server } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));

  if (server.id === '') {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home' },
    { label: `Edit: ${server.name}` },
  ];

  return (
    <Layout navItems={navItems} containerSize={'sm'}>
      <Group align="center">
        <Title>{server.name}</Title>
        <Avatar src={server.icon} alt={'Profile icon'} />
      </Group>
      <Text color={'dimmed'}>Here you can edit the settings for your Server</Text>
      <Space h={'xl'} />
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 700, cols: 1 },
        ]}
      >
        <KibanaButton
          icon={autoIcon}
          text={'Auto actions'}
          subtext={'Automatic actions'}
          to={`/server/${server.id}/actions`}
        />
        <KibanaButton
          icon={roleMenuIcon}
          text={'Role menu'}
          subtext={'Create a role menu where user can give themself roles'}
          to={`/server/${server.id}/roleMenu`}
        />
        <KibanaButton
          icon={voiceActivity}
          text={'Voice Activity'}
          subtext={'Show your voice activity'}
          to={`/server/${server.id}/activity`}
        />
      </SimpleGrid>
    </Layout>
  );
}
