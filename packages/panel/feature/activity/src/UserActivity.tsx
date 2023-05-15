'use client';

import { Loading } from '@eve/panel/feature/core';
import { ReducedUser } from '@eve/types/api';
import dayjs from 'dayjs';
import { useState } from 'react';
import VoiceActivity from './components/VoiceActivity';
import useUserActivity from './hooks/useUserActivity';
import useUserVoiceActivityCsvExport from './hooks/useUserVoiceActivityCsvExport';

type UserActivityProps = {
  user: ReducedUser,
}

export default function UserActivity({ user }: UserActivityProps) {
  const [date, setDate] = useState<[Date, Date]>([dayjs().subtract(7, 'days').toDate(), new Date()]);

  const { items, loading, error } = useUserActivity(user.id, date[0], date[1]);
  const { loading: exportLoading, doExport } = useUserVoiceActivityCsvExport(user.id, date[0], date[1]);

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
      type={'User'}
    />
  );
}
