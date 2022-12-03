import { FormattedPublicLogRecord } from '@eve/types/api';
import { MultiSelect, SelectItem } from '@mantine/core';
import { ReactElement, useMemo } from 'react';

type UserFilterProps = {
  filteredUser: string[],
  setFilteredUser: (filteredUser: string[]) => void,
  logs: FormattedPublicLogRecord[],
}

export default function UserFilter({ filteredUser, setFilteredUser, logs }: UserFilterProps): ReactElement {
  const selectItems: SelectItem[] = useMemo(() => {
    return logs.reduce<SelectItem[]>((acc, log) => {
      for (const relatedUser of log.relatedUser) {
        const existingIndex = acc.findIndex((selectItem) => selectItem.value === relatedUser.id);
        if (existingIndex !== -1) {
          continue;
        }
        acc.push({ value: relatedUser.id, label: relatedUser.name });
      }
      return acc;
    }, []);
  }, [logs]);

  return (
    <MultiSelect 
      data={selectItems}
      value={filteredUser}
      onChange={setFilteredUser}
      label={'Filter user'}
      searchable
      clearable
    />
  )
}
