import React from 'react';
import {DateRangePicker} from "@mantine/dates";
import {Button, Group} from "@mantine/core";
import styles from '../styles/ActivityDatePicker.module.css';
import createDateInPast from "../../../util/createDateInPast";

interface ActivityDatePickerProps {
  from: Date,
  to: Date,
  setDate: (from: Date, to: Date) => void,
}

function ActivityDatePicker({from, to, setDate}: ActivityDatePickerProps) {
  return (
    <Group direction="row" align="end" className={styles.group}>
      <DateRangePicker
        className={styles.picker}
        value={[from, to]}
        onChange={(newDate) => {
          if (newDate[0] === null || newDate[1] === null) {
            return;
          }
          setDate(newDate[0], newDate[1]);
        }}
        clearable={false}
      />
      <Button
        variant="subtle"
        onClick={() => setDate(createDateInPast(6.048e+8), createDateInPast(0))}
      >
        Last 7 Days
      </Button>
      <Button
        variant="subtle"
        onClick={() => setDate(createDateInPast(2.628e+9), createDateInPast(0))}
      >
        Last 30 Days
      </Button>
    </Group>
  )
}

export default ActivityDatePicker;
