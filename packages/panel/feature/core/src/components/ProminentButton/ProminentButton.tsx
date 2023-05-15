'use client';

import { ReactElement, useRef } from 'react';
import { Image, Stack, Text } from '@mantine/core';
import useStyles from './prominentButton.styles';
import { useWindowEvent } from '@mantine/hooks';
import Link from 'next/link';

interface ProminentButtonProps {
  to?: string,
  icon: ReactElement | string,
  text: string,
  subtext?: string,
}

export default function ProminentButton({ to, icon, text, subtext }: ProminentButtonProps): ReactElement {
  const { classes } = useStyles();
  const ref = useRef<HTMLDivElement & HTMLAnchorElement>(null);

  useWindowEvent('mousemove', (evt) => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    ref.current.style.setProperty('--xPos', `${x}px`);
    ref.current.style.setProperty('--yPos', `${y}px`);
  });

  let leftIcon = icon;
  if (typeof icon === 'string') {
    leftIcon = <Image src={icon} width={38} height={38} radius={'md'} />;
  }

  if (to) {
    return (
      <Link
        href={to}
        ref={ref}
        className={classes.button}
      >
        <div className={classes.buttonContent}>
          {leftIcon}
          <Stack>
            <Text className={classes.text} size={'xl'}>{text}</Text>
            {subtext && <Text color={'dimmed'} className={classes.subText}>{subtext}</Text>}
          </Stack>
        </div>
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={classes.button}
    >
      <div className={classes.buttonContent}>
        {leftIcon}
        <Stack>
          <Text className={classes.text} size={'xl'}>{text}</Text>
          {subtext && <Text color={'dimmed'} className={classes.subText}>{subtext}</Text>}
        </Stack>
      </div>
    </div>
  );
}
