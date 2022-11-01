import { ReactElement } from 'react';
import Link from 'next/link';
import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { BreadCrumpItem } from '@eve/types/api';

type NavigationBreadcrumbsProps = {
  items: BreadCrumpItem[],
}

export default function NavigationBreadcrumbs({ items }: NavigationBreadcrumbsProps): ReactElement {
  return (
    <Breadcrumbs>
      {items.map(item => {
        if (!item.to) {
          return <Text key={item.label} color={'dark.1'}>{item.label}</Text>;
        }
        return (
          <Anchor component={Link} href={item.to} key={item.label} passHref>
            {item.label}
          </Anchor>
        );
      })}
    </Breadcrumbs>
  );
}
