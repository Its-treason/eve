import React, { ReactElement } from 'react';
import Layout from '../../components/Layout';
import { Container, Space, Text, Title } from '@mantine/core';
import KibanaButton from '../../components/KibanaButton';

export default function LoginPage(): ReactElement {
  let error = '';
  if ((new URLSearchParams(window.location.search)).get('failed') === 'true') {
    error = 'An error occurred while logging you in. Please try again.';
  }

  return (
    <Layout containerSize={"xs"}>
      <Title>Greetings!</Title>
      <Text>Welcome to EVE's control panel!</Text>
      <Space h={'xl'} />
      <KibanaButton
        // @ts-ignore - See https://vitejs.dev/guide/env-and-mode.html
        href={import.meta.env.VITE_AUTH_URL}
        icon={'/assets/discord-logo.png'}
        text={'Login with Discord'}
        subtext={'Please login to configure the bot settings for your server'}
      />
      <Space h={'xs'} />
      <Text color={'red'}>{error}</Text>
    </Layout>
  );
}
