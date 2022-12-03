import { FormattedPublicLogRecord } from '@eve/types/api';
import { useEffect, useMemo, useState } from 'react';

type LogFilterData = {
  filteredLogs: FormattedPublicLogRecord[],
  search: string,
  filteredUser: string[],
  setSearch: (search: string) => void,
  setFilteredUser: (filteredUser: string[]) => void,
}

export default function useFilter(logs: FormattedPublicLogRecord[]): LogFilterData {
  const [search, setSearch] = useState('');
  const [filteredUser, setFilteredUser] = useState<string[]>([]);

  const filteredLogs: FormattedPublicLogRecord[] = useMemo(()=> {
    return logs.filter((log) => {
      if (!log.message.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
        return false;
      }

      if (filteredUser.length === 0) {
        return true;
      }
      for (const logUser of log.relatedUser) {
        if (filteredUser.includes(logUser.id)) {
          return true;
        }
      }
      return false
    })
  }, [logs, search, filteredUser]);

  return {
    filteredLogs,
    search,
    filteredUser,
    setSearch,
    setFilteredUser,
  };
}
