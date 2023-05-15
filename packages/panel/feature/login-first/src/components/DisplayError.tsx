'use client';

import { Alert } from '@mantine/core';
import { useCallback, useState } from 'react';
import { AlertTriangle } from 'tabler-icons-react';

type DisplayErrorProps = {
  error: string,
}

export default function DisplayError({ error }: DisplayErrorProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleOnClose = useCallback(() => {
    setDismissed(true);
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <Alert
      title={'Login failed'}
      icon={<AlertTriangle />}
      color={'red'}
      withCloseButton
      closeButtonLabel={''}
      onClose={handleOnClose}
      sx={{ margin: '0 4px 24px 4px' }}
    >
      {error}
    </Alert>
  );
}
