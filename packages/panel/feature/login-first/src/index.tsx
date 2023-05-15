'use client';

import { ProminentButton } from '@eve/panel/feature/core';
import { Title, Text, Space, Container } from '@mantine/core';
import { ReactElement } from 'react';
import DisplayError from './components/DisplayError';

type LoginFirstProps = {
  error?: string,
}

export default function LoginFirst({ error }: LoginFirstProps): ReactElement {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

  console.log(authUrl);

  return (
    <Container size={'xs'}>
      <Title>Greetings!</Title>
      <Text>Welcome to EVE's control panel!</Text>
      <Space h={'xl'} />
      {error && <DisplayError error={error} />}
      <ProminentButton
        to={authUrl}
        icon={'/assets/discord-logo.png'}
        text={'Login with Discord'}
        subtext={'Please login to configure the bot settings for your server'}
      />
    </Container>
  );
}
