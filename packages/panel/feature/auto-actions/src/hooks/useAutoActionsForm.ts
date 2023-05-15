import { Ajax } from '@eve/panel/feature/core';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

interface UseAutoActionsData<K extends AbstractPayload> {
  save: () => Promise<void>,
  loading: boolean,
  form: UseFormReturnType<K>,
  error: string | null,
}

type AbstractPayload = Record<never, never>;

export default function useAutoActionsForm<K extends AbstractPayload, T extends z.ZodTypeAny>(
  actionType: string,
  serverId: string,
  initialValues: K,
  schema: T,
): UseAutoActionsData<K> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<K>({
    initialValues,
    validateInputOnBlur: true,
    validate: zodResolver(schema),
  });

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      setError(null);
      setLoading(true);
      const searchParams = { type: actionType };
      const response = await Ajax.get<K>(
        `/v1/server/${serverId}/setting`,
        searchParams,
        { signal: abortController.signal },
      );
      setLoading(false);
      if (!response.data) {
        setError(response.error);
        return;
      }

      form.setValues(response.data);
      form.resetDirty();
    })();

    return () => {
      abortController.abort();
    };
  }, [serverId, actionType]);

  const save = useCallback(async () => {
    setError(null);
    setLoading(true);
    const body = JSON.stringify({ payload: form.values, type: actionType });
    const response = await Ajax.put(`/v1/server/${serverId}/setting`, body);
    setLoading(false);

    if (response.error) {
      setError(response.error);
      showNotification({
        title: 'An error occurred while saving action',
        message: response.error,
        color: 'red',
      });
      return;
    }
    showNotification({
      title: 'Saved action',
      message: 'Action was saved successfully',
    });
  }, [form, serverId, actionType]);

  return { loading, error, form, save };
}
