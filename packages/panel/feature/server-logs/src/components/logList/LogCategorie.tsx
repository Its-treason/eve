/* eslint-disable camelcase */
import { PublicLogCategories } from '@eve/core';
import { Badge } from '@mantine/core';
import { ReactElement } from 'react';

const categoryMapping: Record<PublicLogCategories, string> = {
  AutoActionExecuted: 'Action executed',
  CommandUsed: 'command used',
  ErrorOccurred: 'Internal error occurred',
  ModerationCommandUsed: 'Moderation command used',
  SettingChanged: 'Panel setting changed',
  NativeModerationAction: 'Native Moderation Action',
};

type LogCategoryProps = {
  categorie: PublicLogCategories,
}

export default function LogCategory({ categorie }: LogCategoryProps): ReactElement {
  return (
    <Badge>{categoryMapping[categorie] || 'N/A'}</Badge>
  );
}
