import { FormattedPublicLogRecord, ReducedServer } from '@eve/types/api'
import { Divider, Text } from '@mantine/core';
import Filter from './components/filter/Filter';
import LogsList from './components/logList/LogsList';
import useFilter from './hooks/useFilter';

type LogsComponentProps = {
  server: ReducedServer,
  initialLogs: FormattedPublicLogRecord[],
}

export default function LogsComponent({ server, initialLogs }: LogsComponentProps) {
  const { filteredLogs, filteredUser, search, setFilteredUser, setSearch } = useFilter(initialLogs);

  return (
      <div>
        <Text>All activity connected to the EVE-Bot is shown here. Logs are automaticity deleted after 30 days.</Text>
        <Divider my={'xs'} />
        <Filter
          filteredUser={filteredUser}
          logs={initialLogs}
          search={search}
          setFilteredUser={setFilteredUser}
          setSearch={setSearch}
        />
        <Divider my={'xs'} />
        <LogsList items={filteredLogs} />
      </div>
  );
}
