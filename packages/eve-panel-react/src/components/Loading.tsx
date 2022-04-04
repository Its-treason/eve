import React, { ReactElement } from 'react';
import { ProgressBar } from 'react-bootstrap';
import styles from './styles/Loading.module.css';

export default function Loading(): ReactElement {
  return (
    <div className={styles.loadWrapper}>
      <img className={styles.img} alt="anime dance gif" src="https://cdn.discordapp.com/emojis/735742281189163019.gif?size=256" />
      <ProgressBar className={styles.loadBar} animated now={100} variant="primary" />
    </div>
  );
}
