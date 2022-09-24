import {DateRangePicker} from "@mantine/dates";
import {Button, createStyles, Divider, Group} from "@mantine/core";
import { FileExport } from 'tabler-icons-react';
import dayjs from 'dayjs';

const useStyles = createStyles(() => ({
  picker: {
    flexGrow: 1,
    minWidth: 250,
  },

  group: {
    margin: "1rem 0",
  },
}))

type ActivityDatePickerProps = {
  from: Date,
  to: Date,
  setDate: (from: Date, to: Date) => void,
  exportCsvData: () => void,
}

function ActivityDatePicker({from, to, setDate, exportCsvData}: ActivityDatePickerProps) {
  const { classes } = useStyles();

  return (
    <Group align="end" className={classes.group}>
      <DateRangePicker
        className={classes.picker}
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
        onClick={() => {
          const from = dayjs().subtract(7, 'days').toDate();
          const to = new Date();

          setDate(from, to);
        }}
      >
        Last 7 Days
      </Button>
      <Button
        variant="subtle"
        onClick={() => {
          const from = dayjs().subtract(30, 'days').toDate();
          const to = new Date();

          setDate(from, to);
        }}
      >
        Last 30 Days
      </Button>
      <Divider sx={{ height: 34 }} orientation="vertical" />
      <Button
        rightIcon={<FileExport size={20} />}
        variant="filled"
        onClick={exportCsvData}
      >
        Export as Csv
      </Button>
    </Group>
  )
}

export default ActivityDatePicker;
