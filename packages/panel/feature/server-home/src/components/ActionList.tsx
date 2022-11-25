import { ProminentButton } from '@eve/panel/feature/core';
import { ReducedServer } from '@eve/types/api';
import { SimpleGrid } from '@mantine/core';
import { Menu2, Notebook, Rocket, Subtask } from 'tabler-icons-react';

type ActionListProps = {
  server: ReducedServer,
}

export default function ActionList({ server }: ActionListProps) {
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 700, cols: 1 },
      ]}
    >
      <ProminentButton
        icon={<Subtask />}
        text={'Auto actions'}
        subtext={'Automatic actions'}
        to={`/server/${server.id}/actions`}
      />
      <ProminentButton
        icon={<Menu2 />}
        text={'Role menu'}
        subtext={'Create a role menu where user can give themself roles'}
        to={`/server/${server.id}/roleMenu`}
      />
      <ProminentButton
        icon={<Rocket />}
        text={'Voice Activity'}
        subtext={'Your members voice activity'}
        to={`/server/${server.id}/activity`}
      />
      <ProminentButton
        icon={<Notebook />}
        text={'Logs'}
        subtext={'EVE activity logs'}
        to={`/server/${server.id}/logs`}
      />
    </SimpleGrid>
  )
}
