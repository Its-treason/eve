import { Layout } from '@eve/panel/feature/core';
import { Button, Code, Paper, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { Home } from 'tabler-icons-react';

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
            If your problem persists, contact me at please: <Code>eve@its-treason.com</Code>
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
