import { ReactElement } from 'react';
import { Anchor, Group, Stack, Text, Image } from '@mantine/core';
import { PlaylistItem } from '@eve/types/api';

interface DisplayPlaylistItemProps {
  item: PlaylistItem,
}

export default function DisplayPlaylistItem({ item }: DisplayPlaylistItemProps): ReactElement {
  return (
    <Group noWrap>
      <Image
        src={`https://img.youtube.com/vi/${item.ytId}/0.jpg`}
        alt={`Thumbnail of ${item.title}`}
        height={60}
        width={'auto'}
      />
      <Stack spacing={'xs'}>
        <Text>{item.title} uploaded by {item.uploader}</Text>
        <Anchor
          className={'text-ellipsis'}
          href={item.url}
          target={'_blank'}
          rel={'noreferrer'}
          lineClamp={1}
        >
          {item.url}
        </Anchor>
      </Stack>
    </Group>
  );
}
