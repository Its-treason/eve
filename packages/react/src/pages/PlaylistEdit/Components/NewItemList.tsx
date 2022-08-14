import { ReactElement } from 'react';
import { Checkbox, Group, Text } from '@mantine/core';
import produce from 'immer';
import DisplayPlaylistItem from './DisplayPlaylistItem';
import { CheckablePlaylistItem } from '../../../types';

interface NewItemListProps {
  newItems: CheckablePlaylistItem[],
  setNewItems: (newItems: CheckablePlaylistItem[]) => void,
}

export default function NewItemList({ newItems, setNewItems }: NewItemListProps): ReactElement {
  if (newItems.length === 0) {
    return (
      <Group style={{ width: '100%' }} position={'center'}>
        <Text>Nothing found</Text>
      </Group>
    );
  }

  return (
    <>
      <Group
        direction={'column'}
        style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', overflowX: 'hidden' }}
        noWrap
      >
        {newItems.map((item, index) => {
          return (
            <Group key={index} direction={'row'} noWrap>
              <Checkbox
                checked={item.checked}
                onChange={() => {
                  setNewItems(produce(newItems, draft => {
                    draft[index].checked = !draft[index].checked;
                  }));
                }}
              />
              <DisplayPlaylistItem item={item.item} />
            </Group>
          );
        })}
      </Group>
      <Text>Found {newItems.length} results</Text>
    </>
  );
}
