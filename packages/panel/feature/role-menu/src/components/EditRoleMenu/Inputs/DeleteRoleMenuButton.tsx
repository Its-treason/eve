import { Button } from '@mantine/core'
import { useCallback } from 'react'
import { TrashX } from 'tabler-icons-react'

type DeleteRoleMenuButtonProps = {
  setDeleteDialogOpen: (state: boolean) => void,
}

export default function DeleteRoleMenuButton({ setDeleteDialogOpen }: DeleteRoleMenuButtonProps) {
  const handleClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, [setDeleteDialogOpen]);

  return (
    <Button
      color={'red'}
      onClick={handleClick}
      fullWidth
      variant={'outline'}
      leftIcon={<TrashX />}
    >Delete role menu</Button>
  );
}
