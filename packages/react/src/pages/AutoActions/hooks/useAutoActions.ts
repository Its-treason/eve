import {useEffect, useState, SetStateAction, Dispatch} from 'react';
import AutoActionsApi from '../../../api/AutoActionsApi';

interface UseAutoActionsData<K extends AbstractPayload> {
  save: () => Promise<void>,
  error: string|null,
  payload: K,
  setPayload: Dispatch<SetStateAction<K>>,
  loading: boolean,
}

type AbstractPayload = Record<never, never>;

export default function useAutoActions<K extends AbstractPayload>(actionType: string, serverId: string): UseAutoActionsData<K> {
  const [payload, setPayload] = useState<K>(Object);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (serverId === '') {
      return;
    }

    (async () => {
      setLoading(true);
      const result = await AutoActionsApi.loadActions(actionType, serverId);
      setLoading(false);
      if (typeof result === 'string') {
        setError(result);
        return;
      }

      setError(null);
      setPayload(result as K);
    })();
  }, [serverId, actionType]);

  const save = async () => {
    setLoading(true);
    const payloadAsString = (JSON.stringify(payload));
    const result = await AutoActionsApi.saveActions(actionType, serverId, payloadAsString);
    setLoading(false);

    setError(null);
    if (result !== true) {
      setError(result);
    }
  };

  return { payload, setPayload, error, loading, save };
}
