import { ReactElement, useEffect, useState } from 'react';
import { TextInput, Button, Modal } from '@mantine/core';
import { PlaylistItem } from '../../../api/sharedApiTypes';
import PlaylistApi from '../../../api/PlaylistApi';
import { useNotifications } from '@mantine/notifications';
import { CheckablePlaylistItem } from '../../../types';
import Loading from '../../../components/Loading';
import NewItemList from './NewItemList';

interface AddSongDialogProps {
  open: boolean,
  close: () => void,
  append: (...items: PlaylistItem[]) => void,
  userId: string,
}

export default function AddSongDialog({ open, close, append, userId }: AddSongDialogProps): ReactElement {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [newItems, setNewItems] = useState<CheckablePlaylistItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<PlaylistItem[]>([]);
  const notifications = useNotifications();

  async function search(): Promise<void> {
    setLoading(true);
    const result = await PlaylistApi.search(query, userId);
    setLoading(false);

    if (typeof result === 'string') {
      notifications.showNotification({
        title: 'An error occurred while searching',
        message: result,
        color: 'red',
      });
      return;
    }

    setNewItems(result.playlistItems.map((item) => {
      return {
        item,
        checked: result.allChecked,
      };
    }));
  }

  useEffect(() => {
    setCheckedItems(newItems.reduce<PlaylistItem[]>((acc, item) => {
      if (item.checked) {
        acc.push(item.item);
      }
      return acc;
    }, []));
  }, [newItems]);

  return (
    <Modal
      opened={open}
      onClose={close}
      title={'Add songs'}
      size={'lg'}
    >
      <TextInput
        placeholder="Query..."
        label="Search Query"
        required
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        disabled={loading}
      />
      <Button
        fullWidth
        onClick={search}
        disabled={loading || query.length === 0}
        style={{ margin: '10px 0' }}
      >Search</Button>
      {loading ?
        <Loading /> :
        <NewItemList newItems={newItems} setNewItems={setNewItems} />
      }
      <Button
        fullWidth
        onClick={() => {
          append(...checkedItems);
          setNewItems([]);
          setQuery('');
          close();
        }}
        disabled={loading || newItems.length === 0}
        style={{ marginTop: '10px' }}
      >
        Save
      </Button>
    </Modal>
  );
}
