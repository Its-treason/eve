import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {Anchor, Breadcrumbs, Text} from '@mantine/core';
import styles from './styles/NavigationBreadcrumbs.module.css';
import { BreadCrumpItem } from '../types';

interface Props {
  items: BreadCrumpItem[],
}

export default function NavigationBreadcrumbs({ items }: Props): ReactElement {
  return (
    <Breadcrumbs className={styles.wrapper}>
      {items.map(item => {
        if (!item.to) {
          return <Text key={item.label} className={styles.linkActive}>{item.label}</Text>;
        }
        return <Anchor
          component={Link}
          key={item.label}
          className={styles.link}
          to={item.to}
        >{item.label}</Anchor>;
      })}
    </Breadcrumbs>
  );
}
