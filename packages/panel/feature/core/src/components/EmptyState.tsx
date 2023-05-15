'use client';

import { ReactElement } from 'react';
import { Button, createStyles, Image, Paper, Stack, Text, Title } from '@mantine/core';

const useStyles = createStyles(() => ({
  paper: {
    width: 450,
    margin: '50px auto',
  },
}));

interface EmptyStateProps {
  text: string,
  subText: string,
  action?: {
    callback: () => void,
    text: string,
  },
}

export default function EmptyState({ text, subText, action }: EmptyStateProps): ReactElement {
  const { classes } = useStyles();

  return (
    <Paper p={'xl'} className={classes.paper} withBorder>
      <Stack align={'center'} spacing={'xs'}>
        <Image
          width={200}
          height={200}
          alt="Kanna with magnifying glass"
          src="/assets/kanna.png"
        />
        <Title order={2}>{text}</Title>
        <Text color={'dimmed'}>{subText}</Text>
        {action && (
          <Button size={'md'} onClick={action.callback}>{action.text}</Button>
        )}
      </Stack>
    </Paper>
  );
}
