import { createStyles, getStylesRef } from '@mantine/core';

const styles = createStyles((theme, _params) => {
  return {
    button: {
      textDecoration: 'none',
      color: 'unset',
      position: 'relative',
      background: `
        radial-gradient(
          120rem circle at var(--xPos) var(--yPos),
          ${theme.fn.rgba(theme.fn.primaryColor(), 0.4)},
          transparent 15%
        )
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      borderRadius: theme.radius.md,

      '&:hover': {
        boxShadow: '0 1px 5px rgba(0,0,0,0.1),0 3px 13px rgba(0,0,0,0.07),0 8px 23px rgba(0,0,0,0.06),0 23px 35px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transform: 'scale(1.01)',

        '&::before': {
          opacity: 1,
        },
      },

      '&::before': {
        content: '""',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 'inherit',
        background: `
          radial-gradient(
            90rem circle at var(--xPos) var(--yPos),
            ${theme.fn.rgba(theme.fn.primaryColor(), 0.15)},
            transparent 35%
          )
        `,
        filter: 'blur(5px)',
        opacity: 0,
      },

      '&:active': {
        transform: 'translateY(1px)',
      },

      [`&:hover .${getStylesRef('text')}`]: {
        textDecoration: 'underline',
        userSelect: 'none',
      },
    },

    buttonContent: {
      margin: '3px 3px',
      width: '100%',
      height: 'calc(100% - 3px)',
      padding: 24,
      display: 'grid',
      gridTemplateColumns: '38px auto',
      gridGap: theme.spacing.lg,
      background: theme.colors.dark[7],
      borderRadius: 'inherit',
      transition: 'all 0.25s',
    },

    text: {
      textDecoration: 'none',
      ref: getStylesRef('text'),
      transitionDuration: '.3s',
    },

    subText: {
      textDecoration: 'none',
      userSelect: 'none',
    },
  };
});

export default styles;
