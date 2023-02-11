import { ReactElement } from 'react';
import { AppShell, Avatar, Container, createStyles, Group, Header, MantineNumberSize, Title } from '@mantine/core';
import NavigationBreadcrumbs from './NavigationBreadcrumbs';
import { BreadCrumpItem, ReducedServer, ReducedUser } from '@eve/types/api';
import { LogoutButton } from './LogoutButton';
import SubHeading from './SubHeading';

const useStyles = createStyles((theme) => ({
  headerContainer: {
    height: 60,
    display: 'grid',
    gridTemplateRows: '100%',
    gridTemplateColumns: 'auto 1fr auto',
    gap: theme.spacing.md,
  },
}));

interface LayoutProps {
  children: ReactElement|ReactElement[],
  navItems?: BreadCrumpItem[],
  rightHeaderChildren?: ReactElement|ReactElement[],
  showLogoutBtn?: boolean,
  backTo?: string,
  containerSize?: MantineNumberSize,
  context?: ReducedServer|ReducedUser,
}

export default function Layout({
  children, navItems, rightHeaderChildren, showLogoutBtn, backTo, containerSize, context,
}: LayoutProps): ReactElement {
  const { classes } = useStyles();

  if (!navItems) {
    navItems = [];
  }
  if (typeof showLogoutBtn !== 'boolean') {
    showLogoutBtn = true;
  }
  if (!containerSize) {
    containerSize = 'xl';
  }
  const showSubHeading = (backTo || context);

  return (
    <AppShell
      fixed={true}
      header={
        <Header height={showSubHeading ? 112 : 60}>
          <Container size={'xl'} className={classes.headerContainer}>
            <Group position={'left'} spacing={'xl'}>
              <Group>
                <Avatar size={'md'} src={'/assets/eve-logo.png'} />
                <Title order={1} color={'gray.1'}>EVE</Title>
              </Group>
              <NavigationBreadcrumbs items={navItems} />
            </Group>
            <Group position={'right'}>
              {rightHeaderChildren}
              {showLogoutBtn && <LogoutButton />}
            </Group>
          </Container>
          {showSubHeading && <SubHeading context={context} backTo={backTo} />}
        </Header>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[8] },
      })}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </AppShell>
  );
}
