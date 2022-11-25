import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  userBox: {
    display: 'grid',
    gridTemplateRows: '100%',
    gridTemplateColumns: '24px auto',

    border: `1px solid ${theme.colors.dark[8]}`,
    gap: theme.spacing.xs,
    padding: theme.spacing.xs / 2,
    borderRadius: theme.radius.md,
  },

  userList: {
    gridColumnStart: 'span 2',
  }
}));
