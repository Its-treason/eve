import { useEffect, useState } from 'react';

interface IdValidInfo {
  valid: boolean,
  error: string,
}

export default function useIdValidation(id: string): IdValidInfo {
  const [valid, setValid] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id.length === 0) {
      setValid(true);
      setError('');
      return;
    }

    if (id.length !== 18) {
      setValid(false);
      setError(`Expected 18 characters got ${id.length}`);
      return;
    }
    if (!/\d{18}/.test(id)) {
      setValid(false);
      setError('Id must only contain numbers!');
      return;
    }

    setValid(true);
    setError('');
  }, [id]);

  return { valid, error };
}
