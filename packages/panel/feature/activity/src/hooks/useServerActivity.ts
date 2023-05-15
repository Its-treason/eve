import { Ajax } from '@eve/panel/feature/core';
import { ActivityRow } from '@eve/types/api';
import { useEffect, useState } from 'react';

interface UseServerActivityData {
  items: ActivityRow[],
  loading: boolean,
  error: string | false,
}

export default function useServerActivity(serverId: string, startDate: Date, endDate: Date): UseServerActivityData {
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | false>(false);

  useEffect(() => {
    if (startDate === null || endDate === null) {
      return;
    }

    const abortController = new AbortController();
    (async () => {
      setLoading(true);
      const body = JSON.stringify({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      const response = await Ajax.post<ActivityRow[]>(`/v1/server/${serverId}/activity`, body, { signal: abortController.signal });
      setLoading(false);

      if (!response.data) {
        setError(response.error);
        setItems([]);
        return;
      }

      setError(false);
      setItems(response.data);
    })();

    return () => {
      abortController.abort();
    };
  }, [serverId, startDate, endDate]);

  return { items, loading, error };
}
