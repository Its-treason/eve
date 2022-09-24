import { ProminentButton } from '@eve/panel/feature/core';
import { ReducedUser } from '@eve/types/api';
import { SimpleGrid } from '@mantine/core';
import { Microphone2, Playlist } from 'tabler-icons-react';

type ActionListProps = {
  user: ReducedUser,
}

export default function ActionList({ user }: ActionListProps) {
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 700, cols: 1 },
      ]}
    >
      <ProminentButton
        icon={<Playlist size={32} />}
        text={'Playlist'}
        subtext={'Edit your playlists'}
        to={`/user/${user.id}/playlist`}
      />
      <ProminentButton
        icon={<Microphone2 size={32} />}
        text={'Voice activity'}
        subtext={'Check your voice activity'}
        to={`/user/${user.id}/activity`}
      />
    </SimpleGrid>
  )
}
