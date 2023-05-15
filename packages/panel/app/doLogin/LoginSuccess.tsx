'use client';

import { ApiKey, Layout } from '@eve/panel/feature/core';
import { Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type LoginSuccessProps = {
  apiKey: string,
}

export default function LoginSuccess({ apiKey }: LoginSuccessProps) {
  const router = useRouter();

  useEffect(() => {
    ApiKey.setApiKey(apiKey);
    router.push('/');
  }, [apiKey]);

  return (
    <Layout showLogoutBtn={false} containerSize={'xs'}>
      <Title mx={'auto'}>Login successful! Redirecting...</Title>
    </Layout>
  );
}
