import { ProminentButton } from '@eve/panel/feature/core';
import { ReducedUser } from '@eve/types/api';
import { Title } from '@mantine/core';

type HeaderProps = {
  user: ReducedUser,
}

export default function Header({ user }: HeaderProps) {
  return (
    <>
      <Title mb={'xl'} order={1}>Greetings {user.name}!</Title>
      <ProminentButton 
        to={`/user/${user.id}/home`}
        text={user.name}
        subtext={'Edit your user settings'}
        icon={user.icon}
      />
    </>
  );
}
