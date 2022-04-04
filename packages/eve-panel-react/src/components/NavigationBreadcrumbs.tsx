import { ReactElement } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './styles/NavigationBreadcrumbs.module.css';
import { BreadCrumpItem } from '../types';

interface Props {
  items: BreadCrumpItem[],
}

export default function NavigationBreadcrumbs({ items }: Props): ReactElement {
  return (
    <Breadcrumb className={styles.wrapper}>
      {items.map(item => {
        if (item.active) {
          return <Breadcrumb.Item key={item.label} className={styles.linkActive} active>{item.label}</Breadcrumb.Item>;
        }
        item.to = item.to ?? '';
        return <Breadcrumb.Item key={item.label} className={styles.link} linkAs={Link} linkProps={{ to: item.to }}>{item.label}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
}
