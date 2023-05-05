import { ReactElement, useEffect, useState } from 'react';
import { TextInput, Button, Modal, Group } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import SearchResultList from './SearchResultList';
import { CheckablePlaylistItem, PlaylistItem } from '@eve/types/api';
import { Loading, musicSearch } from '@eve/panel/feature/core';
import { Plus, Search } from 'tabler-icons-react';
import { getCookie } from 'cookies-next';

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

  async function search(): Promise<void> {
    const apiKey = String(getCookie('apiKey'));

    setLoading(true);
    const result = await musicSearch(query, userId, apiKey);
    setLoading(false);

    if (typeof result === 'string') {
      showNotification({
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
      size={'xl'}
    >
      <Group align={'flex-end'} m={'16px 0'}>
        <TextInput
          placeholder="Query..."
          label="Search Query"
          required
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          disabled={loading}
          sx={{ flexGrow: 1 }}
        />
        <Button
          onClick={search}
          disabled={loading || query.length === 0}
          leftIcon={<Search />}
        >Search</Button>
      </Group>
      {loading ? (
        <Loading />
      ) : (
        <SearchResultList newItems={newItems} setNewItems={setNewItems} />
      )}
      <Button
        mt={16}
        leftIcon={<Plus />}
        fullWidth
        onClick={() => {
          append(...checkedItems);
          setNewItems([]);
          setQuery('');
          close();
        }}
        disabled={loading || checkedItems.length === 0}
      >
        Add to playlist
      </Button>
    </Modal>
  );
}
