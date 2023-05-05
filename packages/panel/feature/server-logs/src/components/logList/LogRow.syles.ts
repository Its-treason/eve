import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  box: {
    display: 'grid',
    gridTemplateRows: '60% 40%',
    gridTemplateColumns: 'auto 200px',

    padding: theme.spacing.sm,
    gap: `calc(${theme.spacing.xs} / 1.5) 0`,
  },
  date: {
    gridColumnStart: 'span 2',
  },
}));
