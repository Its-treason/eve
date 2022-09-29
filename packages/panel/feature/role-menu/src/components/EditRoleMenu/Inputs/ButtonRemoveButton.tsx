import { RoleMenu } from '@eve/core'
import { Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form'
import { useCallback } from 'react';

type ButtonRemoveButtonProps = {
  form: UseFormReturnType<RoleMenu>,
  index: number,
}

// This is the naming masterclass
export default function ButtonRemoveButton({ form, index }: ButtonRemoveButtonProps) {
  const handleClick = useCallback(() => {
    form.removeListItem('entries', index)
  }, [form, index]);

  return (
    <Button
      mt={25}
      color={'red'}
      onClick={handleClick}
      style={{width: 100}}
    >Remove</Button>
  );
}
