import {useMemo, useState} from "react";
import useRoleMenus from "./hooks/useRoleMenus";
import { Accordion, Button, Text } from "@mantine/core";
import produce from "immer";
import CreateRoleMenu from "./components/CreateRoleMenu";
import { Plus } from 'tabler-icons-react';
import { ReducedServer, RoleMenu } from '@eve/types/api';
import { EmojiContext, EmptyState, useEmojis, useServerChannel, useServerRoles } from '@eve/panel/feature/core';
import EditRoleMenu from './components/EditRoleMenu/EditRoleMenu';

type RoleMenuProps = {
  server: ReducedServer,
  initialRoleMenus: RoleMenu[],
}

function RoleMenu({ server, initialRoleMenus}: RoleMenuProps) {
  const [createRoleMenuDialogOpen, setCreateRoleMenuDialogOpen] = useState(false);
  const { roleMenuLoading, roleMenuError, roleMenus, updateRoleMenus, setRoleMenus } = useRoleMenus(server.id, initialRoleMenus);

  const { channel, channelError, channelLoading } = useServerChannel(server.id);
  const { roles, rolesLoading } = useServerRoles(server.id);
  const emojis = useEmojis(server.id);

  const loading = channelLoading || roleMenuLoading || rolesLoading;

  const formattedRoles = useMemo(() => {
    return roles.map(role => {
      return {
        value: role.id,
        label: `${role.name} ${role.isModerator ? '[M]' : ''} ${role.isModerator ? '[A]' : ''}`,
      };
    });
  }, [roles]);

  return (
    <EmojiContext.Provider value={emojis}>
      <Button
        leftIcon={<Plus />}
        onClick={() => setCreateRoleMenuDialogOpen(true)}
        disabled={createRoleMenuDialogOpen}
      >Create role menu</Button>
      <CreateRoleMenu
        opened={createRoleMenuDialogOpen}
        serverId={server.id}
        close={shouldUpdateRoleMenus => {
          setCreateRoleMenuDialogOpen(false);
          if (shouldUpdateRoleMenus) {
            updateRoleMenus();
          }
        }}
      />
      <Text color={'red'}>{roleMenuError}</Text>
      <Text color={'red'}>{channelError}</Text>
      {(roleMenus.length === 0 && !loading) && 
        <EmptyState
          text={'Looks like you haven\'t have any role menus created yet'}
          subText={'Create a role menu by clicking the button in the top left corner'}
          action={{
            callback: () => setCreateRoleMenuDialogOpen(true),
            text: 'Create role menu',
          }}
        />
      }
      <Accordion variant="separated" mt={'md'}>
        {roleMenus.map((menu) => {
          return (
            <Accordion.Item value={menu.name} key={menu.id}>
              <Accordion.Control>{menu.name}</Accordion.Control>
              <Accordion.Panel sx={(theme) => ({ background: theme.colors.gray[9] })}>
                <EditRoleMenu
                  roleMenu={menu}
                  channel={channel}
                  formattedRoles={formattedRoles}
                  updateMenus={updateRoleMenus}
                  serverId={server.id}
                />
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </EmojiContext.Provider>
  )
}

export default RoleMenu;
