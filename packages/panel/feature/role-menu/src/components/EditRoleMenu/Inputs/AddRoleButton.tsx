import { RoleMenu } from '@eve/core';
import { Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { ButtonStyle } from 'discord-api-types/v9';
import { useCallback } from 'react';
import { Plus } from 'tabler-icons-react';

type AddRoleButtonProps = {
  form: UseFormReturnType<RoleMenu>,
}

export default function AddRoleButton({ form }: AddRoleButtonProps) {
  const handleClick = useCallback(() => {
    form.insertListItem('entries', { role: '', label: '', color: ButtonStyle.Primary });
  }, [form]);

  return (
    <Button
      onClick={handleClick}
      leftIcon={<Plus />}
      w={130}
      disabled={form.values.entries.length >= 25}
    >Add role</Button>
  );
}
