import { FormattedPublicLogRecord } from '@eve/types/api';
import { Stack } from '@mantine/core';
import { ReactElement } from 'react';
import LogRow from './LogRow';

type LogsListProps = {
  items: FormattedPublicLogRecord[],
}

export default function LogsList({ items }: LogsListProps): ReactElement {
  const elements = items.map((item) => {
    return <LogRow item={item} key={item.timestamp} />;
  });

  return (
    <Stack>
      {elements}
    </Stack>
  );
}
