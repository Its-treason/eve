import React, { ReactElement } from 'react';
import { Text } from '@mantine/core';
import styles from './styles/Loading.module.css';

interface EmptyStateProps {
  text: string,
  subText: string,
}

export default function EmptyState({ text, subText }: EmptyStateProps): ReactElement {
  return (
    <div className={styles.loadWrapper}>
      <img className={styles.img} alt="Kanna with magnifying glass" src="https://stickers.wiki/static/stickers/kobayashismaiddragon/file_81510.webp?ezimgfmt=rs:134x134/rscb1/ng:webp/ngcb1" />
      <Text>{text}</Text>
      <Text color={'dimmed'}>{subText}</Text>
    </div>
  );
}
