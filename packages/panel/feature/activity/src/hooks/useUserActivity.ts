import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { getUserActivity } from '@eve/panel/feature/core';
import { ActivityRow } from '@eve/types/api';

interface UseUserActivityData {
  items: ActivityRow[],
  loading: boolean,
  error: string|false,
}

export default function useUserActivity(userId: string, startDate: Date, endDate: Date): UseUserActivityData {
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|false>(false);

  useEffect(() => {
    if (startDate === null || endDate === null) {
      return;
    }

    const abortController = new AbortController();
    (async () => {
      const apiKey = String(getCookie('apiKey'));

      setLoading(true);
      const result = await getUserActivity(userId, startDate, endDate, apiKey, abortController);
      setLoading(false);

      if (typeof result === 'string') {
        setError(result);
        setItems([]);
        return;
      }

      setError(false);
      setItems(result);
    })();

    return () => {
      abortController.abort();
    };
  }, [userId, startDate, endDate]);

  return { items, loading, error };
}
