import { ReactElement } from 'react';
import { PlaylistItem } from '../../../api/sharedApiTypes';
import { Group } from '@mantine/core';

interface DisplayPlaylistItemProps {
  item: PlaylistItem,
}

export default function DisplayPlaylistItem({ item }: DisplayPlaylistItemProps): ReactElement {
  return (
    <Group direction={'row'} noWrap>
      <img
        src={`https://img.youtube.com/vi/${item.ytId}/0.jpg`}
        alt={`Thumbnail of ${item.title}`}
        height={50}
      />
      <Group direction={'column'} noWrap>
        <span className={'text-ellipsis'}>{item.title} uploaded by {item.uploader}</span>
        <a
          className={'text-ellipsis'}
          href={item.url}
          target={'_blank'}
          rel="noreferrer"
        >{item.url}</a>
      </Group>
    </Group>
  );
}
