import { useCallback, useState } from 'react';
import { Tabs, Text, Title } from '@mantine/core';
import JoinMessage from './components/JoinMessage';
import LeaveMessage from './components/LeaveMessage';
import AutoRoles from './components/AutoRoles';
import TemplateLegendModal from './components/TemplateLegendDialog';
import { ReducedServer } from '@eve/types/api';
import { useHash } from '@mantine/hooks';
import { EmptyState } from '@eve/panel/feature/core';

type AutoActionsProps = {
  server: ReducedServer,
}

function AutoActions({ server }: AutoActionsProps) {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [hash, setHash] = useHash();

  const openDocs = useCallback(() => {
    setTemplateDialogOpen(true);
  }, []);
  const closeDocs = useCallback(() => {
    setTemplateDialogOpen(false);
  }, []);

  return (
    <>
      <Title>Auto Actions</Title>
      <Text>EVE can react to various events (e.g. a new member joining the server) and perform an action.</Text>
      <Text color={'dimmed'}>Actions will not be saved automatically, be sure to save them before exiting this page.</Text>

      <Tabs
        orientation={'vertical'}
        mt={'xl'}
        value={hash.replace('#', '') || 'default'}
        onTabChange={(value) => setHash(value ?? 'default')}
      >
        <Tabs.List>
          <Tabs.Tab value={'join-message'}>Join Message</Tabs.Tab>
          <Tabs.Tab value={'leave-message'}>Leave Message</Tabs.Tab>
          <Tabs.Tab value={'auto-roles'}>Auto Roles</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='default'>
          <EmptyState text={'No tab selected'} subText={'Select a tab on the left to edit an action'} />
        </Tabs.Panel>

        <Tabs.Panel value={'join-message'} pl={'xl'}>
          <JoinMessage serverId={server.id} openDocs={openDocs} />
        </Tabs.Panel>
        <Tabs.Panel value={'leave-message'} pl={'xl'}>
          <LeaveMessage serverId={server.id} openDocs={openDocs} />
        </Tabs.Panel>
        <Tabs.Panel value={'auto-roles'} pl={'xl'}><AutoRoles serverId={server.id} /></Tabs.Panel>
      </Tabs>

      <TemplateLegendModal opened={templateDialogOpen} close={closeDocs} />
    </>
  );
}

export default AutoActions;
