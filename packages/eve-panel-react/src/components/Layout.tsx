import { ReactElement } from 'react';
import * as Bootstrap from 'react-bootstrap';
import { Avatar, Center, Space, Text, Container } from '@mantine/core';
import NavigationBreadcrumbs from './NavigationBreadcrumbs';
import { BreadCrumpItem } from '../types';
import {MantineNumberSize} from "@mantine/styles";

interface LayoutProps {
  children: ReactElement|ReactElement[],
  navItems?: BreadCrumpItem[],
  containerSize?: MantineNumberSize,
}

export default function Layout({ children, navItems, containerSize }: LayoutProps): ReactElement {
  if (!navItems) {
    navItems = [];
  }
  if (!containerSize) {
    containerSize = 'xl';
  }

  return (
    <main>
      <Bootstrap.Navbar bg="primary">
        <Bootstrap.Container style={{ justifyContent: 'start' }}>
          <Bootstrap.Navbar.Brand href='/home'>
            <Center style={{ gap: '10px' }}>
              <Avatar src='/assets/eve-logo.png' />
              <Text size={'xl'}>EVE</Text>
            </Center>
          </Bootstrap.Navbar.Brand>
          <NavigationBreadcrumbs items={navItems} />
        </Bootstrap.Container>
      </Bootstrap.Navbar>
      <Space h={'xl'} />
      <Container size={containerSize} style={{ height: 'calc(100vh - 88px)', overflowY: 'auto', width: '100%' }}>
        {children}
      </Container>
    </main>
  );
}
