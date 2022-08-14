import { ReactElement } from 'react';
import {AppShell, Avatar, Button, Container, Group, Header, Title} from '@mantine/core';
import { BreadCrumpItem } from '../types';
import { MantineNumberSize } from "@mantine/styles";
import NavigationBreadcrumbs from "./NavigationBreadcrumbs";
import styles from './styles/Layout.module.css';

interface LayoutProps {
  children: ReactElement|ReactElement[],
  navItems?: BreadCrumpItem[],
  containerSize?: MantineNumberSize,
  rightHeaderChildren?: ReactElement|ReactElement[]
}

export default function Layout({ children, navItems, rightHeaderChildren, containerSize }: LayoutProps): ReactElement {
  if (!navItems) {
    navItems = [];
  }

  return (
    <AppShell
      fixed={true}
      header={
        <Header height={60}>
          <Container size={'xl'} className={styles.headerContainer}>
            <Container className={styles.headerLeft}>
              <Group>
                <Avatar size={'md'} src={'/assets/eve-logo.png'} />
                <Title>EVE</Title>
              </Group>
              <NavigationBreadcrumbs items={navItems} />
            </Container>
            <Container className={styles.headerRight}>
              {rightHeaderChildren}
            </Container>
          </Container>
        </Header>
      }
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </AppShell>
  );
}
