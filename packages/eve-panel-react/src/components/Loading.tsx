import React, { ReactElement } from 'react';
import { Loader } from '@mantine/core';
import styles from './styles/Loading.module.css';

export default function Loading(): ReactElement {
  return (
    <div className={styles.loadWrapper}>
      <img
        className={styles.img}
        alt="anime dance gif"
        src="https://cdn.discordapp.com/emojis/735742281189163019.gif?size=256"
      />
      <Loader size="xl" variant="dots" />
    </div>
  );
}
