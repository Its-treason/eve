import { ReducedUser } from '@eve/types/api';
import { Group, Text, Image, Code } from '@mantine/core';
import { ReactElement, useMemo } from 'react';
import useStyles from './RelatedUser.styles';

type RelatedUserProps = {
  user: ReducedUser[],
}

export default function RelatedUser({ user }: RelatedUserProps): ReactElement {
  const { classes } = useStyles();

  const userElements = useMemo(() => {
    return user.map((user) => {
      return (
        <div className={classes.userBox} key={user.id}>
          <Image src={user.icon} width={24} height={24} radius={'md'} />
          <Text>{user.name} <Code>{user.id}</Code></Text>
        </div>
      );
    });
  }, [user]);

  return (
    <Group className={classes.userList} spacing={'xs'}>
      {userElements}
    </Group>
  );
}
