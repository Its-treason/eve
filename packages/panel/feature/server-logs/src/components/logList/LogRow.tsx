import { DisplayDate } from '@eve/panel/feature/core';
import { FormattedPublicLogRecord } from '@eve/types/api';
import { Card, Paper, Text } from '@mantine/core';
import { ReactElement } from 'react';
import LogCategory from './LogCategorie';
import RelatedUser from './RelatedUser';
import useStyles from './LogRow.syles';

type LogRowProps = {
  item: FormattedPublicLogRecord,
}

export default function LogRow({ item }: LogRowProps): ReactElement {
  const { classes } = useStyles();

  return (
    <Paper className={classes.box}>
      <Text size={'sm'} ><DisplayDate date={item.timestamp} /></Text>
      <LogCategory categorie={item.categorie} />
      <div className={classes.date}>{item.message}</div>
      <RelatedUser user={item.relatedUser} />
    </Paper>
  );
}
