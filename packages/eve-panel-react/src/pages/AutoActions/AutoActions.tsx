import React, {useContext, useState} from "react";
import useUserServerFromParams from "../../hooks/useUserServerFromParams";
import {useParams} from "react-router-dom";
import LoggedInUserContext from "../../context/LoggedInUserContext";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import {BreadCrumpItem} from "../../types";
import {Accordion, Text, Title} from "@mantine/core";
import JoinMessage from "./components/JoinMessage";
import LeaveMessage from "./components/LeaveMessage";
import AutoRoles from "./components/AutoRoles";
import TemplateLegendDialog from "./components/TemplateLegendDialog";

function AutoActions() {
  const { server } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  if (server.name === '') {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home' },
    { label: `Edit: ${server.name}`, to: `/server/${server.id}/home` },
    { label: `Auto Actions` },
  ];

  function openDocs() {
    setTemplateDialogOpen(true);
  }
  function closeDocs() {
    setTemplateDialogOpen(false);
  }

  return (
    <Layout navItems={navItems} containerSize={'md'}>
      <Title>Auto Actions!</Title>
      <Text>EVE can react to various events (e.g. a new member joining the server) and perform an action.</Text>
      <Text color={'dimmed'}>Actions will not be saved automatically, be sure to save them before exiting this page.</Text>
      <Accordion multiple>
        <Accordion.Item value={'Join message'}>
          <Accordion.Control>Join message</Accordion.Control>
          <Accordion.Panel>
            <JoinMessage serverId={server.id} openDocs={openDocs} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value={'Leave message'}>
          <Accordion.Control>Leave message</Accordion.Control>
          <Accordion.Panel>
            <LeaveMessage serverId={server.id} openDocs={openDocs} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value={'Auto roles'}>
          <Accordion.Control>Auto roles</Accordion.Control>
          <Accordion.Panel>
            <AutoRoles serverId={server.id} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <TemplateLegendDialog opened={templateDialogOpen} close={closeDocs} />
    </Layout>
  )
}

export default AutoActions;
