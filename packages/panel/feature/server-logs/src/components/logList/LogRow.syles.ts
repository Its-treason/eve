import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  box: {
    display: 'grid',
    gridTemplateRows: '60% 40%',
    gridTemplateColumns: 'auto 200px',

    padding: theme.spacing.sm,
    gap: `${theme.spacing.xs / 2}px 0`,
  },
  date: {
    gridColumnStart: 'span 2',
  },
}));
