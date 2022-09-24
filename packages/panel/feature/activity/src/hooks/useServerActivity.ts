import { getServerActivity } from '@eve/panel/feature/core';
import { ActivityRow } from '@eve/types/api';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

interface UseServerActivityData {
  items: ActivityRow[],
  loading: boolean,
  error: string|false,
}

export default function useServerActivity(serverId: string, startDate: Date, endDate: Date): UseServerActivityData {
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
      const result = await getServerActivity(serverId, startDate, endDate, apiKey, abortController);
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
  }, [serverId, startDate, endDate]);

  return { items, loading, error };
}
