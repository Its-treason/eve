import { Alert } from '@mantine/core';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { AlertTriangle } from 'tabler-icons-react';

export default function DisplayInvalidPlaylistError() {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  const handleOnClose = useCallback(() => {
    setDismissed(true);

    router.push(window.location.pathname, undefined, { shallow: true });
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <Alert
      title={'Invalid Playlist'}
      icon={<AlertTriangle />}
      color={'red'}
      withCloseButton
      closeButtonLabel={''}
      onClose={handleOnClose}
      sx={{ margin: '8px 4px 24px 4px' }}
    >
      Looks like you tried to edit a playlist that doesn't exist. Because of that you got redirected here.
    </Alert>
  );
}
