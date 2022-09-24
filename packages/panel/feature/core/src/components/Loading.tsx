import { ReactElement } from 'react';
import { createStyles, Image, Loader, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  loadWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
}));

type LoadingProps = {
  msg?: string,
}

export default function Loading({ msg }: LoadingProps): ReactElement {
  const { classes } = useStyles();

  return (
    <div className={classes.loadWrapper}>
      <Image
        width={200}
        height={200}
        alt="anime dance gif"
        src="/assets/loader.gif"
      />
      <Loader size="xl" variant="dots" />
      {msg && <Text color={'dark.1'} size={'xl'}>{msg}</Text>}
    </div>
  );
}
