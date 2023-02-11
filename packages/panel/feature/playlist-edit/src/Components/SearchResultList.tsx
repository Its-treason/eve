import { ReactElement, MouseEvent } from 'react';
import { Checkbox, Group, Paper, Stack, Text, UnstyledButton } from '@mantine/core';
import produce from 'immer';
import DisplayPlaylistItem from './DisplayPlaylistItem';
import { CheckablePlaylistItem } from '@eve/types/api';

interface SearchResultListProps {
  newItems: CheckablePlaylistItem[],
  setNewItems: (newItems: CheckablePlaylistItem[]) => void,
}

export default function SearchResultList({ newItems, setNewItems }: SearchResultListProps): ReactElement {
  if (newItems.length === 0) {
    return (
      <Group style={{ width: '100%' }} position={'center'}>
        <Text>Nothing found</Text>
      </Group>
    );
  }

  return (
    <Paper m={'16px 0'}>
      <Stack
        style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {newItems.map((item, index) => {
          return (
            <UnstyledButton
              component={Group}
              key={index}
              noWrap
              onClick={(evt: MouseEvent<HTMLDivElement>) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - Wrong type might be used for the event here
                if (evt.target.nodeName !== 'A') {
                  setNewItems(produce(newItems, (draft) => {
                    draft[index].checked = !draft[index].checked;
                  }));
                }
              }}
            >
              <Checkbox
                checked={item.checked}
                onChange={() => {
                  setNewItems(produce(newItems, (draft) => {
                    draft[index].checked = !draft[index].checked;
                  }));
                }}
              />
              <DisplayPlaylistItem item={item.item} />
            </UnstyledButton>
          );
        })}
      </Stack>
    </Paper>
  );
}
