import { ReactElement, useCallback, useState } from 'react';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import { Logout } from 'tabler-icons-react';
import { LogoutApiResponseData } from '@eve/types/api';
import Ajax from '../../api/Ajax';

export function LogoutButton(): ReactElement {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const doLogout = useCallback(async () => {
    setLoading(true);
    await Ajax.get<LogoutApiResponseData>('/v1/login/logout');

    deleteCookie('apiKey');
    router.push('/loginFirst');
  }, []);

  return (
    <Button
      disabled={loading}
      color={'red'}
      onClick={doLogout}
      leftIcon={<Logout />}
    >
      Logout
    </Button>
  );
}
