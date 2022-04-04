import React from "react";
import {ActivityRow} from "../../../api/sharedApiTypes";
import {ThemeIcon} from "@mantine/core";
import styles from '../styles/ActivityTableRow.module.css';

interface ActivityRowProps {
  row: ActivityRow,
}

function ActivityTableRow({row}: ActivityRowProps) {
  return (
    <tr>
      <td className={styles.iconCell}>
        <ThemeIcon className={styles.icon}>
          <img height={16} src={row.guildIcon} alt={`Icon the the "${row.guildName}" Guild`} />
        </ThemeIcon>
        {row.guildName}
      </td>
      <td>{row.guildId}</td>
      <td>{row.channelName}</td>
      <td>{row.channelId}</td>
      <td>{new Date(row.joinedAt).toLocaleString()}</td>
      <td>{new Date(row.leftAt).toLocaleString()}</td>
      <td>{row.length}</td>
    </tr>
  )
}

export default ActivityTableRow;
