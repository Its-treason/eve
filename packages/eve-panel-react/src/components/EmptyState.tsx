import { ReactElement } from 'react';
import { Button, Space, Text } from '@mantine/core';
import styles from './styles/Loading.module.css';

interface EmptyStateProps {
  text: string,
  subText: string,
  action?: {
    callback: () => void,
    text: string,
  },
}

export default function EmptyState({ text, subText, action }: EmptyStateProps): ReactElement {
  return (
    <div className={styles.loadWrapper}>
      <img
        className={styles.img}
        alt="Kanna with magnifying glass"
        src="https://stickers.wiki/static/stickers/kobayashismaiddragon/file_81510.webp?ezimgfmt=rs:134x134/rscb1/ng:webp/ngcb1"
      />
      <Text>{text}</Text>
      <Text color={'dimmed'}>{subText}</Text>
      {action && (
        <Button sx={{marginTop: 18}} onClick={action.callback}>{action.text}</Button>
      )}
    </div>
  );
}
