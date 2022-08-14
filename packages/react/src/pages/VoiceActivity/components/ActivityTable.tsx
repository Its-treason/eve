import { Table, Image } from '@mantine/core';
import { ReactElement, useMemo } from 'react';
import { ActivityRow } from '../../../api/sharedApiTypes';

type ActivityTableProps = {
  items: ActivityRow[],
  type: 'User'|'Server',
}

export default function ActivityTable({ items, type }: ActivityTableProps): ReactElement {
  const rows: ReactElement[] = useMemo(() => {
    return items.map((row) => {
      return (
        <tr key={`${row.joinedAt}${row.leftAt}`}>
          <td>
            <Image
              height={18}
              width={18}
              src={type === 'Server' ? row.userIcon : row.guildIcon}
              alt={`Icon of "${type === 'Server' ? row.userName : row.guildName}"`}
            />
          </td>
          <td>{type === 'Server' ? row.userName : row.guildName}</td>
          <td>{type === 'Server' ? row.userId : row.guildId}</td>
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
          <th>{type === 'Server' ? 'User' : 'Server'}</th>
          <th></th>
          <th>{type === 'Server' ? 'User' : 'Server'} ID</th>
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
