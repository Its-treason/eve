import {ReactElement, useContext, useState} from 'react';
import Layout from '../../components/Layout';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { BreadCrumpItem } from '../../types';
import useServerActivity from './hooks/useServerActivity';
import useCsvExport from './hooks/useServerVoiceActivityCsvExport';
import VoiceActivity from './components/VoiceActivity';
import useUserServerFromParams from "../../hooks/useUserServerFromParams";
import LoggedInUserContext from '../../context/LoggedInUserContext';

export default function ServerVoiceActivity(): ReactElement {
  const { server } = useUserServerFromParams(useParams(), useContext(LoggedInUserContext));

  const [date, setDate] = useState<[Date, Date]>([new Date(Date.now() - 8.64e+7), new Date()]);

  const { items, loading, error } = useServerActivity(server.id, date[0], date[1]);
  const { loading: exportLoading, doExport } = useCsvExport(server.id, date[0], date[1]);

  const navItems: BreadCrumpItem[] = [
    { label: 'Home', to: '/home' },
    { label: `Edit: ${server.name}`, to: `/server/${server.id}/home` },
    { label: 'Voice activity' },
  ];

  if (loading || exportLoading || server.id === '') {
    return <Layout><Loading /></Layout>;
  }

  return (
    <Layout navItems={navItems} containerSize={'xl'}>
      <VoiceActivity
        items={items}
        fromDate={date[0]}
        toDate={date[1]}
        doExport={doExport}
        setDate={setDate}
        error={error}
        type={'Server'}
      />
    </Layout>
  );
}
