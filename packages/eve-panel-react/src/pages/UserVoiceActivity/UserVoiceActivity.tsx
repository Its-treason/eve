import React, {ReactElement, useContext, useMemo, useState} from 'react';
import Layout from '../../components/Layout';
import {Title, Text, Table, Container} from '@mantine/core';
import { useParams } from 'react-router-dom';
import useUserServerFromParams from '../../hooks/useUserServerFromParams';
import Loading from '../../components/Loading';
import { BreadCrumpItem } from '../../types';
import LoggedInUserContext from '../../context/LoggedInUserContext';
import useUserActivity from './hooks/useUserActivity';
import ActivityDatePicker from "./components/ActivityDatePicker";
import useCsvExport from './hooks/useCsvExport';
import ActivityTable from './components/ActivityTable';

export default function UserVoiceActivity(): ReactElement {
  const { user } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));

  const [date, setDate] = useState<[Date, Date]>([new Date(Date.now() - 8.64e+7), new Date()]);

  const { items, loading, error } = useUserActivity(user.id, date[0], date[1]);
  const { loading: exportLoading, doExport } = useCsvExport(user.id, date[0], date[1]);

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home' },
    { label: `Edit: ${user.name}`, to: `/user/${user.id}/home` },
    { label: 'Voice activity' },
  ];

  if (loading || exportLoading || user.id === '') {
    return <Layout>
      <Loading />
    </Layout>
  }

  return (
    <Layout navItems={navItems} containerSize={'xl'}>
      <Container>
        <Title>Voice activity!</Title>
        <Text color={'red'}>{error}</Text>
        <ActivityDatePicker
          from={date[0]}
          to={date[1]}
          setDate={(from, to) => setDate([from, to])}
          exportCsvData={doExport}
        />
      </Container>
      <Container size={'xl'} sx={{ height: 'calc(100vh - 210px)', overflowY: 'scroll' }}>
        <ActivityTable items={items} />
      </Container>
    </Layout>
  );
}
