import dayjs from 'dayjs';
import { ReactElement, useEffect, useState } from 'react';

type DisplayDateProps = {
  date: string,
}

export default function DisplayDate({ date }: DisplayDateProps): ReactElement {
  const [formattedDate, setFormattedDate] = useState<string>('00:00:00 2000-00-00');

  useEffect(() => {
    if (!window) {
      return;
    }
    setFormattedDate(dayjs(date).format('HH:DD:ss YYYY-MM-DD'));
  }, [date])

  return (
    <>{formattedDate}</>
  )
}
