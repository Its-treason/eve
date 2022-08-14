import {ActivityRow} from '../../../api/sharedApiTypes';
import { useEffect, useState } from 'react';
import ActivityApi from '../../../api/ActivityApi';

interface UseServerActivityData {
  items: ActivityRow[],
  loading: boolean,
  error: string|false,
}

export default function useServerActivity(serverid: string, startDate: Date, endDate: Date): UseServerActivityData {
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|false>(false);

  useEffect(() => {
    if (serverid === '' || startDate === null || endDate === null) {
      return;
    }

    const abortController = new AbortController();
    (async () => {
      setLoading(true);
      const result = await ActivityApi.getServerActivity(serverid, startDate, endDate, abortController);
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
  }, [serverid, startDate, endDate]);

  return { items, loading, error };
}
