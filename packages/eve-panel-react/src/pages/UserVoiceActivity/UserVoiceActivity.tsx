import React, {ReactElement, useContext, useMemo, useState} from 'react';
import Layout from '../../components/Layout';
import {Title, Text, Table} from '@mantine/core';
import { useParams } from 'react-router-dom';
import useUserServerFromParams from '../../hooks/useUserServerFromParams';
import Loading from '../../components/Loading';
import { BreadCrumpItem } from '../../types';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import useUserActivity from './hooks/useUserActivity';
import ActivityTableRow from "./components/ActivityTableRow";
import ActivityDatePicker from "./components/ActivityDatePicker";

export default function UserVoiceActivity(): ReactElement {
  const { user } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));

  const [date, setDate] = useState<[Date, Date]>([new Date(Date.now() - 8.64e+7), new Date()]);

  const { items, loading, error } = useUserActivity(user.id, date[0], date[1]);

  const rows: ReactElement[] = useMemo(() => {
    return items.map((item, index) => {
      return <ActivityTableRow row={item} key={index} />
    })
  }, [items]);

  if (user.id === '') {
    return (
      <Layout>
        <Loading/>
      </Layout>
    );
  }

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home', active: false },
    { label: `Edit: ${user.name}`, to: `/user/${user.id}/home`, active: false },
    { label: 'Voice activity', active: true },
  ];

  if (loading) {
    return <Layout>
      <Loading />
    </Layout>
  }

  return (
    <Layout navItems={navItems}>
      <Title>Voice activity!</Title>
      <Text color={'red'}>{error}</Text>
      <ActivityDatePicker
        from={date[0]}
        to={date[1]}
        setDate={(from, to) => setDate([from, to])}
      />
      <Table striped highlightOnHover captionSide={"bottom"}>
        <caption>
          {rows.length === 0 ?
            'Nothing to show for this time range' :
            'Values with "Not available" mean that the user/guild/channel was deleted or is not accessible'
          }
        </caption>
        <thead>
          <tr>
            <th>Server</th>
            <th>Server ID</th>
            <th>Channel</th>
            <th>Channel ID</th>
            <th>Joined at</th>
            <th>Left at</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Layout>
  );
}
