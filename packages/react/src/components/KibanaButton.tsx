import { ReactElement } from 'react';
import { Avatar, createStyles, Group, Paper, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    paper: {
      margin: 5,
      transitionDuration: '.3s',
      display: 'grid',
      gridTemplateColumns: '38px auto',
      gridGap: theme.spacing.lg,
      backgroundColor: '#1b1c2e',

      '&:hover': {
        boxShadow: '0 1px 5px rgba(0,0,0,0.1),0 3px 13px rgba(0,0,0,0.07),0 8px 23px rgba(0,0,0,0.06),0 23px 35px rgba(0,0,0,0.05)',
      },

      [`&:hover .${getRef('text')}`]: {
        textDecoration: 'underline',
      }
    },

    text: {
      ref: getRef('text'),
      transitionDuration: '.3s',
    },
  }
})

interface LinkUserServerProps {
  to?: string,
  href?: string,
  icon: string,
  text: string,
  subtext?: string,
}

export default function KibanaButton({ to, icon, text, subtext, href }: LinkUserServerProps): ReactElement {
  const { classes } = useStyles();

  return (
    <Paper
      component={Link}
      to={to || ''}
      p="md"
      withBorder
      className={classes.paper}
      onClick={() => href && window.location.replace(href)}
    >
      <Avatar src={icon} size={'md'} />
      <Stack justify={'flex-start'} sx={{'gap': 4}}>
        <Text className={classes.text} size={'lg'}>{text}</Text>
        {subtext && <Text color={'dimmed'}>{subtext}</Text>}
      </Stack>
    </Paper>
  );
}
