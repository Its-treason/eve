import { Table, Image } from '@mantine/core';
import { ReactElement, useMemo } from 'react';
import { ActivityRow } from '../../../api/sharedApiTypes';

type ActivityTableProps = {
  items: ActivityRow[],
}

export default function ActivityTable({ items }: ActivityTableProps): ReactElement {
  const rows: ReactElement[] = useMemo(() => {
    return items.map((row) => {
      return (
        <tr key={`${row.joinedAt}${row.leftAt}`}>
          <td>
            <Image
              height={18}
              width={18}
              src={row.guildIcon}
              alt={`Icon the the "${row.guildName}" Guild`}
            />
          </td>
          <td>{row.guildName}</td>
          <td>{row.guildId}</td>
          <td>{row.channelName}</td>
          <td>{row.channelId}</td>
          <td>{new Date(row.joinedAt).toLocaleString()}</td>
          <td>{new Date(row.leftAt).toLocaleString()}</td>
          <td>{row.length}</td>
        </tr>
      )
    })
  }, [items]);

  return (
    <Table striped highlightOnHover captionSide={"bottom"}>
      <caption>
        {rows.length === 0 ?
          'Nothing to show for this time range' :
          'Values with "Not available" mean that the user/guild/channel was deleted or is not accessible to the bot'
        }
      </caption>
      <thead>
        <tr>
          <th>Server</th>
          <th></th>
          <th>Server ID</th>
          <th>Channel</th>
          <th>Channel ID</th>
          <th>Joined at</th>
          <th>Left at</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}
