import { Button, Group, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Pencil } from 'tabler-icons-react';

const idRegex = /\d{18,20}/;

export default function GoToUser() {
  const router = useRouter();
  const [id, setId] = useState('');

  const idValid = useMemo(() => {
    return (idRegex.test(id) || id === '');
  }, [id]);

  return (
    <Group>
      <TextInput
        label={'Edit another users settings'}
        placeholder={'UserId'}
        value={id}
        onChange={(evt) => setId(evt.currentTarget.value)}
        sx={{ flexGrow: 1 }}
        error={!idValid}
      />
      <Button
        mt={'xl'}
        leftIcon={<Pencil />}
        disabled={!idValid || id.length === 0}
        onClick={() => router.push(`/user/${id}/home`)}
      >
        Edit
      </Button>
    </Group>
  );
}
