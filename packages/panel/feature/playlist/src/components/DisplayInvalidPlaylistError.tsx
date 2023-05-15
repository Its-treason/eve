import { Alert } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { AlertTriangle } from 'tabler-icons-react';

export default function DisplayInvalidPlaylistError() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleOnClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('invalidName');
    router.push(pathname + '?' + params.toString());
  }, []);

  if (!searchParams.has('invalidName')) {
    return null;
  }

  return (
    <Alert
      title={'Invalid Playlist'}
      icon={<AlertTriangle />}
      color={'red'}
      withCloseButton
      closeButtonLabel={'Dismiss'}
      onClose={handleOnClose}
      sx={{ margin: '8px 4px 24px 4px' }}
    >
      Looks like you tried to edit a playlist that doesn't exist. Because of that you got redirected here.
    </Alert>
  );
}
