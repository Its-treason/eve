import { ReactElement, useRef } from 'react';
import { Image, Paper, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import useStyles from './prominentButton.styles';
import { useWindowEvent } from '@mantine/hooks';

interface ProminentButtonProps {
  to?: string,
  icon: ReactElement|string,
  text: string,
  subtext?: string,
}

export default function ProminentButton({ to, icon, text, subtext }: ProminentButtonProps): ReactElement {
  const { classes } = useStyles();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

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
    leftIcon = <Image src={icon} width={38} height={38} />;
  }

  return (
    <div
      ref={ref}
      className={classes.button}
      onClick={() => to && router.push(to)}
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
