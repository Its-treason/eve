import React, {useContext, useState} from "react";
import Layout from "../../components/Layout";
import {BreadCrumpItem} from "../../types";
import useUserServerFromParams from "../../hooks/useUserServerFromParams";
import {useParams} from "react-router-dom";
import LoggedInUserContext from "../../context/LoggedInUserContext";
import Loading from "../../components/Loading";
import useRoleMenus from "./hooks/useRoleMenus";
import {Accordion, Button, Text} from "@mantine/core";
import DisplayRoleMenu from "./components/DisplayRoleMenu";
import useServerChannel from "../../hooks/useServerChannel";
import produce from "immer";
import useServerRoles from "../../hooks/useServerRoles";
import CreateRoleMenu from "./components/CreateRoleMenu";
import EmptyState from "../../components/EmptyState";

function RoleMenu() {
  const [createRoleMenuDialogOpen, setCreateRoleMenuDialogOpen] = useState(false);

  const { server } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));
  const { roleMenuLoading, roleMenuError, roleMenus, updateRoleMenus, setRoleMenus } = useRoleMenus(server.id);
  const { channel, channelError, channelLoading } = useServerChannel(server.id);
  const { roles, rolesLoading } = useServerRoles(server.id);

  const loading = channelLoading || roleMenuLoading || rolesLoading;

  if (server.name === '') {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  const formattedRoles = roles.map(role => {
    return {
      value: role.id,
      label: `${role.name} ${role.isModerator ? '[M]' : ''} ${role.isModerator ? '[A]' : ''}`,
    };
  });

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home' },
    { label: `Edit: ${server.name}`, to: `/server/${server.id}/home` },
    { label: `Role menu` },
  ];

  return (
    <Layout navItems={navItems}>
      <Button
        onClick={() => setCreateRoleMenuDialogOpen(true)}
        disabled={createRoleMenuDialogOpen}
      >Create role menu</Button>
      <CreateRoleMenu
        opened={createRoleMenuDialogOpen}
        serverId={server.id}
        close={(shouldUpdateRoleMenus => {
          setCreateRoleMenuDialogOpen(false);
          if (shouldUpdateRoleMenus) {
            updateRoleMenus();
          }
        })}
      />
      <Text color={'red'}>{roleMenuError}</Text>
      <Text color={'red'}>{channelError}</Text>
      {(roleMenus.length === 0 && !loading) &&
        <EmptyState
          text={'Looks like you dont have any role menus created yet'}
          subText={'Create a role menu by clicking the button in the top left corner'}
        />
      }
      <Accordion>
        {roleMenus.map((menu, index) => {
          return (
            <Accordion.Item label={menu.name} key={index}>
              <DisplayRoleMenu
                roleMenu={menu}
                channel={channel}
                formattedRoles={formattedRoles}
                updateMenus={updateRoleMenus}
                setRoleMenu={roleMenu => {
                  setRoleMenus(produce(draft => {
                    draft[index] = roleMenu;
                  }))
                }}
                parentLoading={loading}
                serverId={server.id}
              />
            </Accordion.Item>
          )
        })}
      </Accordion>
    </Layout>
  )
}

export default RoleMenu;
