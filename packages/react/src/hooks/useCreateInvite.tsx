import React, { ReactElement, useState } from 'react';
import GeneralApi from '../api/GeneralApi';
import { Dialog, Group, Text } from '@mantine/core';

interface CreateInviteRes {
  openInviteDialog: () => Promise<void>,
  inviteDialog: ReactElement,
}

export default function useCreateInvite(): CreateInviteRes {
  const [invite, setInvite] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const openInviteDialog = async () => {
    setOpen(true);

    if (invite === '') {
      setLoading(true);

      const result = await GeneralApi.createInvite();

      if (result !== false) {
        setInvite(result.invite);
        setLoading(false);
      }
    }
  };

  const inviteDialog = (
    <Dialog
      opened={open}
      withCloseButton
      onClose={() => setOpen(false)}
      size="lg"
      radius="md"
    >
      <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
        Invite Link
      </Text>
      <Group align="flex-end">
        <Text>{loading ? 'Loading...' : invite}</Text>
      </Group>
    </Dialog>
  );

  return { openInviteDialog, inviteDialog };
}
