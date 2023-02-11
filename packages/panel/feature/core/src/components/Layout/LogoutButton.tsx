import { ReactElement, useCallback } from 'react';
import { Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';
import { Logout } from 'tabler-icons-react';
import { logout } from '../../api/LoginApi';

export function LogoutButton(): ReactElement {
  const router = useRouter();

  const doLogout = useCallback(() => {
    logout().then(() => {
      deleteCookie('apiKey');
      router.push('/loginFirst');
    });
  }, []);

  return (
    <Button
      color={'red'}
      onClick={doLogout}
      leftIcon={<Logout />}
    >
      Logout
    </Button>
  );
}
