import { EmptyState, ProminentButton } from '@eve/panel/feature/core'
import { ReducedServer } from '@eve/types/api'
import { SimpleGrid } from '@mantine/core';
import { useCallback, useMemo } from 'react'

type ServerListProps = {
  servers: ReducedServer[],
  inviteLink: string,
}

export default function ServerList({ servers, inviteLink }: ServerListProps) {
  const openInvite = useCallback(() => {
    window.open(inviteLink, '_blank')?.focus();
  }, [inviteLink]);

  const list = useMemo(() => {
    return servers.map((server) => (
      <ProminentButton
          key={server.id}
          to={`/server/${server.id}/home`}
          text={server.name}
          icon={server.icon}
          subtext={'Configure server settings'}
        />
    ))
  }, [servers]);

  if (list.length === 0) {
    return (
      <EmptyState
        text={'You don\'t have any Server to edit'}
        subText={'Invite the bot to your server to edit settings'}
        action={{ callback: openInvite, text: 'Invite EVE' }}
      />
    );
  }

  return (
    <SimpleGrid
      cols={2}
      sx={{ justifyContent: 'center' }}
      breakpoints={[
        { maxWidth: 700, cols: 1 },
      ]}
    >
      {list}
    </SimpleGrid>
  );
}
