import {ActivityRow} from '../../../api/sharedApiTypes';
import { useEffect, useState } from 'react';
import ActivityApi from '../../../api/ActivityApi';

interface UseUserActivityData {
  items: ActivityRow[],
  loading: boolean,
  error: string|false,
}

export default function useUserActivity(userid: string, startDate: Date, endDate: Date): UseUserActivityData {
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|false>(false);

  useEffect(() => {
    if (userid === '' || startDate === null || endDate === null) {
      return;
    }

    const abortController = new AbortController();
    (async () => {
      setLoading(true);
      const result = await ActivityApi.getUserActivity(userid, startDate, endDate, abortController);
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
  }, [userid, startDate, endDate]);

  return { items, loading, error };
}
