import { ReducedServer } from '@eve/types/api';
import { Stack, Text } from '@mantine/core';
import ActionList from './components/ActionList';

type ServerHomeProps = {
  server: ReducedServer,
}

export default function ServerHome({ server }: ServerHomeProps) {
  return (
    <Stack>
      <ActionList server={server} />
    </Stack>
  )
}
