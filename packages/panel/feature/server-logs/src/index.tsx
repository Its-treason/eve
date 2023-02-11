import { FormattedPublicLogRecord, ReducedServer } from '@eve/types/api';
import { Button, Divider, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Filter from './components/filter/Filter';
import LogsList from './components/logList/LogsList';
import LogSubscriptionModal from './components/subscription/LogSubscriptionModal';
import useFilter from './hooks/useFilter';

type LogsComponentProps = {
  server: ReducedServer,
  initialLogs: FormattedPublicLogRecord[],
}

export default function LogsComponent({ server, initialLogs }: LogsComponentProps) {
  const { filteredLogs, filteredUser, search, setFilteredUser, setSearch } = useFilter(initialLogs);
  const [dialogOpened, dialogHandler] = useDisclosure(false);

  return (
      <div>
        <Text>All activity connected to the EVE-Bot is shown here. Logs are automaticity deleted after 30 days.</Text>
        <Button
          mt={'xs'}
          onClick={dialogHandler.open}
        >Create subscription to channel</Button>
        <LogSubscriptionModal opened={dialogOpened} close={dialogHandler.close} serverId={server.id} />
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
