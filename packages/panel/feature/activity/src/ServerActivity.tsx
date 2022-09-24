import { Loading } from '@eve/panel/feature/core';
import { ReducedServer } from '@eve/types/api';
import { useState } from 'react';
import VoiceActivity from './components/VoiceActivity';
import useServerActivity from './hooks/useServerActivity';
import useCsvExport from './hooks/useServerVoiceActivityCsvExport';

type ServerActivityProps = {
  server: ReducedServer,
}

export default function ServerActivity({ server }: ServerActivityProps) {
  const [date, setDate] = useState<[Date, Date]>([new Date(Date.now() - 8.64e+7), new Date()]);

  const { items, loading, error } = useServerActivity(server.id, date[0], date[1]);
  const { loading: exportLoading, doExport } = useCsvExport(server.id, date[0], date[1]);

  if (loading || exportLoading) {
    return <Loading />;
  }

  return (
    <VoiceActivity
      items={items}
      fromDate={date[0]}
      toDate={date[1]}
      doExport={doExport}
      setDate={setDate}
      error={error}
      type={'Server'}
    />
  );
}
