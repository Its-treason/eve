import { FormattedPublicLogRecord } from '@eve/types/api';
import { Stack } from '@mantine/core';
import { ReactElement } from 'react';
import Search from './Search';
import UserFilter from './UserFilter';

type FilterProps = {
  search: string,
  filteredUser: string[],
  setSearch: (search: string) => void,
  setFilteredUser: (filteredUser: string[]) => void,
  logs: FormattedPublicLogRecord[],
}

export default function Filter({ search, filteredUser, setSearch, setFilteredUser, logs }: FilterProps): ReactElement {
  return (
    <Stack spacing={'xs'}>
      <Search search={search} setSearch={setSearch} />
      <UserFilter filteredUser={filteredUser} setFilteredUser={setFilteredUser} logs={logs} />
    </Stack>
  );
}
