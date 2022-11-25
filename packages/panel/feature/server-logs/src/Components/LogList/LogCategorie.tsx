import { PublicLogCategories } from '@eve/core';
import { Badge } from '@mantine/core';
import { ReactElement } from 'react';

const categoryMapping: Record<PublicLogCategories, string> = {
  auto_action_executed: 'Action executed',
  command_used: 'command used',
  error_occurred: 'Internal error occurred',
  moderation_command_used: 'Moderation command used',
  setting_changed: 'Panel setting changed'
}

type LogCategoryProps = {
  categorie: PublicLogCategories,
}

export default function LogCategory({ categorie }: LogCategoryProps): ReactElement {
  return (
    <Badge>{categoryMapping[categorie] || 'N/A'}</Badge>
  );
}
