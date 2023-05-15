import { Button, Divider } from '@mantine/core';
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
        <Button leftIcon={<UserPlus />} variant="outline" onClick={openInvite}>Invite EVE</Button>
      }
    />
  );
}
