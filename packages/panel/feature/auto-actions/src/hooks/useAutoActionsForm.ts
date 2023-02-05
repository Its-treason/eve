import { loadSetting, saveSetting, useConfirmLeave } from '@eve/panel/feature/core';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
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
    const apiKey = String(getCookie('apiKey'));
    const abortController = new AbortController();

    (async () => {
      setLoading(true);
      const result = await loadSetting(actionType, serverId, apiKey, abortController);
      setLoading(false);
      if (typeof result === 'string') {
        setError(result);
        return;
      }

      setError(null);
      form.setValues(result as K);
      form.resetDirty();
    })();

    return () => {
      abortController.abort();
    }
  }, [serverId, actionType]);

  const save = useCallback(async () => {
    const apiKey = String(getCookie('apiKey'));

    setLoading(true);
    const result = await saveSetting(actionType, serverId, form.values, apiKey);
    setLoading(false);

    setError(null);
    if (result !== true) {
      setError(result);
      showNotification({
        title: 'An error occurred while saving action',
        message: result,
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
