import { ActivityRow } from '@eve/types/api';
import { Container, Title, Text } from '@mantine/core';
import { ReactElement } from 'react';
import ActivityDatePicker from './ActivityDatePicker';
import ActivityTable from './ActivityTable';

type VoiceActivityProps = {
  items: ActivityRow[],
  fromDate: Date,
  toDate: Date,
  setDate: (dates: [Date, Date]) => void,
  doExport: () => void,
  error: string|false,
  type: 'User'|'Server',
}

export default function VoiceActivity(
  { items, fromDate, toDate, setDate, doExport, error, type }: VoiceActivityProps,
): ReactElement {
  return (
    <>
      <Container>
        <Title>Voice activity!</Title>
        <Text color={'red'}>{error}</Text>
        <ActivityDatePicker
          from={fromDate}
          to={toDate}
          setDate={(from, to) => setDate([from, to])}
          exportCsvData={doExport}
        />
      </Container>
      <Container size={'xl'} sx={{ height: 'calc(100vh - 210px)', overflowY: 'scroll' }}>
        <ActivityTable items={items} type={type} />
      </Container>
    </>
  );
}
