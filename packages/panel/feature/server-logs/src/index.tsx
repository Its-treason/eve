import { FormattedPublicLogRecord, ReducedServer } from '@eve/types/api'
import { Table } from '@mantine/core';
import LogsList from './Components/LogList/LogsList';

type LogsComponentProps = {
  server: ReducedServer,
  initialLogs: FormattedPublicLogRecord[],
}

export default function LogsComponent({ server, initialLogs }: LogsComponentProps) {
  return (
      <LogsList items={initialLogs} />
  );
}
