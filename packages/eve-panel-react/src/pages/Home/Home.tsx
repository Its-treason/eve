import { ReactElement, useContext } from 'react';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import { Container, Divider, Space, Title, Text, ActionIcon, Tooltip } from '@mantine/core';
import KibanaButton from '../../components/KibanaButton';
import Layout from '../../components/Layout';
import useCreateInvite from '../../hooks/useCreateInvite';

export default function AdminHome(): ReactElement {
  const user = useContext(LoggedInUserContext);
  const { openInviteDialog, inviteDialog } = useCreateInvite();

  return (
    <Layout>
      {inviteDialog}
      <Container size="sm" className='width-100'>
        <Title order={1}>Greetings {user.name}!</Title>
        <Space h={'xl'} />
        <KibanaButton to={`/user/${user.id}/home`} text={user.name} subtext={'Edit your user settings'} icon={user.icon} />
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
        {user.server.length === 0 ?? <Text>No Server to edit!</Text>}
        {user.server.map((server) => {
          return (
            <span key={server.id}>
              <KibanaButton
                to={`/server/${server.id}/home`}
                text={server.name}
                icon={server.icon}
                subtext={'Configure server settings'}
              />
            </span>
          );
        })}
      </Container>
    </Layout>
  );
}
