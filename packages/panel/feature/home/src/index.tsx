import { ReducedUser } from '@eve/types/api';
import { Stack } from '@mantine/core';
import GoToUser from './components/GoToUser';
import Header from './components/Header';
import InviteDivider from './components/InviteDivider';
import ServerList from './components/ServerList';

type HomeProps = {
  user: ReducedUser,
  inviteLink: string,
}

export default function Home({ user, inviteLink }: HomeProps) {
  return (
    <Stack>
      <Header user={user} />
      {user.admin && <GoToUser />}
      <InviteDivider inviteLink={inviteLink} />
      <ServerList servers={user.server} inviteLink={inviteLink} />
    </Stack>
  );
}
