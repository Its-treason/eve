import { ReactElement } from 'react';
import { createStyles, Image, Paper, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    paper: {
      margin: 5,
      display: 'grid',
      gridTemplateColumns: '38px auto',
      gridGap: theme.spacing.lg,

      '&:hover': {
        boxShadow: '0 1px 5px rgba(0,0,0,0.1),0 3px 13px rgba(0,0,0,0.07),0 8px 23px rgba(0,0,0,0.06),0 23px 35px rgba(0,0,0,0.05)',
        cursor: 'pointer',
      },

      '&:active': {
        transform: 'translateY(1px)',
      },

      [`&:hover .${getRef('text')}`]: {
        textDecoration: 'underline',
        userSelect: 'none'
      }
    },

    text: {
      ref: getRef('text'),
      transitionDuration: '.3s',
    },

    subText: {
      userSelect: 'none'
    },
  }
})

interface ProminentButtonProps {
  to?: string,
  icon: ReactElement|string,
  text: string,
  subtext?: string,
}

export default function ProminentButton({ to, icon, text, subtext }: ProminentButtonProps): ReactElement {
  const { classes } = useStyles();
  const router = useRouter();

  let leftIcon = icon;
  if (typeof icon === 'string') {
    leftIcon = <Image src={icon} width={38} height={38} />;
  }

  return (
    <Paper
      p={'xl'}
      withBorder
      className={classes.paper}
      onClick={() => to && router.push(to)}
    >
      {leftIcon}
      <Stack>
        <Text className={classes.text} size={'xl'}>{text}</Text>
        {subtext && <Text color={'dimmed'} className={classes.subText}>{subtext}</Text>}
      </Stack>
    </Paper>
  );
}
