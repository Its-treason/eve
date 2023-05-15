'use client';

import { ReducedUser } from '@eve/types/api';
import { Stack } from '@mantine/core';
import ActionList from './components/ActionList';

type UserHomeProps = {
  user: ReducedUser,
}

export default function UserHome({ user }: UserHomeProps) {
  return (
    <Stack>
      <ActionList user={user} />
    </Stack>
  );
}
