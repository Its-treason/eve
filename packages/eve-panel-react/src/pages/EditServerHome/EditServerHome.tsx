import React, { ReactElement, useContext } from 'react';
import Layout from '../../components/Layout';
import { Container, Space, Title, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';
import useUserServerFromParams from '../../hooks/useUserServerFromParams';
import KibanaButton from '../../components/KibanaButton';
import Loading from '../../components/Loading';
import { BreadCrumpItem } from '../../types';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import autoIcon from '../../assets/icons/auto.svg';
import roleMenuIcon from '../../assets/icons/role_menu.svg';

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
    { label: 'Home', to: '/home', active: false },
    { label: `Edit: ${server.name}`, active: true },
  ];

  return (
    <Layout navItems={navItems}>
      <Container size={'xs'}>
        <Title>Edit server settings!</Title>
        <Text color={'dimmed'}>Edit settings for {server.name}</Text>
        <Space />
        <KibanaButton
          icon={autoIcon}
          text={'Auto actions'}
          subtext={'Automatic actions'}
          to={`/server/${server.id}/actions`}
        />
        <Space h={'sm'} />
        <KibanaButton
          icon={roleMenuIcon}
          text={'Role menu'}
          subtext={'Create a role menu where user can give themself roles'}
          to={`/server/${server.id}/roleMenu`}
        />
      </Container>
    </Layout>
  );
}
