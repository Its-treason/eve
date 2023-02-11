import { ActionIcon, Divider, Tooltip } from '@mantine/core';
import { useCallback } from 'react';
import { UserPlus } from 'tabler-icons-react';

type InviteDividerProps = {
  inviteLink: string,
}

export default function InviteDivider({ inviteLink }: InviteDividerProps) {
  const openInvite = useCallback(() => {
    window.open(inviteLink, '_blank')?.focus();
  }, [inviteLink]);

  return (
    <Divider
      labelPosition={'right'}
      label={
        <Tooltip label={'Invite the Bot!'}>
          <ActionIcon variant="outline" onClick={openInvite}>
            <UserPlus size={'20'} />
          </ActionIcon>
        </Tooltip>
      }
    />
  );
}
