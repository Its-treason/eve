import { useEffect, useState } from 'react';
import { Ajax } from '@eve/panel/feature/core';
import { ActivityRow, UserActivityApiResponseData } from '@eve/types/api';

interface UseUserActivityData {
  items: ActivityRow[],
  loading: boolean,
  error: string | false,
}

export default function useUserActivity(userId: string, startDate: Date, endDate: Date): UseUserActivityData {
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
      const response = await Ajax.post<UserActivityApiResponseData>(`/v1/user/${userId}/activity`, body, { signal: abortController.signal });
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
  }, [userId, startDate, endDate]);

  return { items, loading, error };
}
