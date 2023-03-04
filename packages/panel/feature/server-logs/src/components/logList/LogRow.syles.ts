import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  box: {
    display: 'grid',
    gridTemplateRows: '60% 40%',
    gridTemplateColumns: 'auto 200px',

    padding: theme.spacing.sm,
    gap: `calc(${theme.spacing.xs} / 2px) 0`,
  },
  date: {
    gridColumnStart: 'span 2',
  },
}));
