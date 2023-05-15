'use client';

import { Button, Paper, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { ReactElement } from 'react';
import { Home } from 'tabler-icons-react';
import Layout from './Layout';

export default function ForbiddenPage(): ReactElement {
  return (
    <Layout backTo={'/'} containerSize={'xs'}>
      <Paper p={'md'} my={'xl'}>
        <Title>403 - Forbidden</Title>
        <Text my={'md'}>
          You do not have permission to access this page
        </Text>
        <Button
          leftIcon={<Home />}
          component={Link}
          href={'/'}
        >
          Back home
        </Button>
      </Paper>
    </Layout>
  );
}
