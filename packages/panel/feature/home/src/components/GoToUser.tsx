import { Button, Group, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

const idRegex = /\d{18,19}/;

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
        error={idValid ? undefined : 'Invalid UserId!'}
        value={id}
        onChange={(evt) => setId(evt.currentTarget.value)}
        sx={{ flexGrow: 1 }}
      />
      <Button
        disabled={!idValid}
        onClick={() => router.push(`/user/${id}/home`)}
      >
        Edit
      </Button>
    </Group>
  );
}
