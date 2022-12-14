import { Button, Code, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { Home } from 'tabler-icons-react';
import Layout from '../feature/core/src/components/Layout';

export default function InternalError() {
  const router = useRouter();

  return (
    <Layout showLogoutBtn={false}>
      <Paper component={Stack}>
        <Stack>
          <Title order={1}>Internal Server Error</Title>
          <Text>
            Oops, this is embarrassing, looks like the server could not handle your request.
          </Text>
          <Text>
            If your problem persists (wich it hopefully not, because that means i
            fucked up) contact me please: <Code>eve@its-treason.com</Code>
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
