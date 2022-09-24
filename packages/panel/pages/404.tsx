import { Button, Stack, Paper, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { Home } from 'tabler-icons-react';
import Layout from '../feature/core/src/components/Layout';

export default function NotFound() {
  const router = useRouter();

  return (
    <Layout showLogoutBtn={false} containerSize={'xs'}>
      <Paper component={Stack} p={'xl'}>
        <Stack>
          <Title order={1}>404 - Not found</Title>
          <Text m={'16px 0'}>
            Looks like the page your looking found could not be found
          </Text>
          <Button
            leftIcon={<Home />}
            onClick={() => router.push('/')}
          >
            Back Home
          </Button>
        </Stack>
      </Paper>
    </Layout>
  );
}
