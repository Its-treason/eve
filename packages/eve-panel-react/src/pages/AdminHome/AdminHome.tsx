import { ReactElement, useContext } from 'react';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import {Divider, Space, Title, ActionIcon, Tooltip, SimpleGrid} from '@mantine/core';
import KibanaButton from '../../components/KibanaButton';
import GoToUser from './components/GoToUser';
import Layout from '../../components/Layout';
import useCreateInvite from '../../hooks/useCreateInvite';
import {LogoutButton} from "../../components/LogoutButton";
import EmptyState from '../../components/EmptyState';

export default function AdminHome(): ReactElement {
  const user = useContext(LoggedInUserContext);
  const { openInviteDialog, inviteDialog } = useCreateInvite();

  return (
    <Layout containerSize={'sm'} rightHeaderChildren={<LogoutButton />}>
      {inviteDialog}
      <Title order={1}>Greetings {user.name}!</Title>
      <Space h={'xl'} />
      <KibanaButton to={`/user/${user.id}/home`} text={user.name} subtext={'Edit your user settings'} icon={user.icon} />
      <Space h={'sm'} />
      <GoToUser />
      <Space h={'xl'} />
      <Divider
        labelPosition={'right'}
        label={
          <Tooltip label={'Invite the Bot!'}>
            <ActionIcon variant="outline" onClick={() => openInviteDialog()}>
              <img style={{ width: 16, height: 16 }} src={'/assets/invite.png'} alt={'invite'} />
            </ActionIcon>
          </Tooltip>
        }
      />
      <Space h={'xl'} />
      <>
        {user.server.length === 0 && (
          <EmptyState
            text={'You dont have any Server to edit'}
            subText={'Invite the bot to your server to edit settings'} 
            action={{ callback: openInviteDialog, text: 'Invite EVE' }}
          />
        )}
        <SimpleGrid
          cols={2}
          sx={{justifyContent: 'center'}}
          breakpoints={[
            { maxWidth: 700, cols: 1 },
          ]}
        >
          {user.server.map((server) => {
            return (
              <KibanaButton
                to={`/server/${server.id}/home`}
                text={server.name}
                icon={server.icon}
                subtext={'Configure server settings'}
              />
            );
          })}
        </SimpleGrid>
      </>
    </Layout>
  );
}
