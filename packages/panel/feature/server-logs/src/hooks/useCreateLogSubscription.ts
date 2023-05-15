import { Ajax } from '@eve/panel/feature/core';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  wantedCategories: z.array(z.string()).min(1),
  channel: z.string().min(1),
  enabled: z.boolean(),
});

type CreateLogSubscriptionReturnType = {
  loading: boolean,
  form: UseFormReturnType<z.infer<typeof schema>>,
  save: () => Promise<boolean>,
  error: string | null,
}

export default function useCreateLogSubscription(serverId: string): CreateLogSubscriptionReturnType {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: { channel: '', wantedCategories: [] as string[], enabled: false },
    validateInputOnBlur: true,
    validate: zodResolver(schema),
  });

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      setLoading(true);
      const body = { type: 'public-logs-subscription' };
      const response = await Ajax.get<Record<string, unknown>>(`/v1/server/${serverId}/setting`, body, { signal: abortController.signal });
      setLoading(false);
      if (!response.data) {
        setError(response.error);
        return;
      }

      setError(null);
      form.setValues(response.data);
      form.resetDirty();
    })();

    return () => {
      abortController.abort();
    };
  }, [serverId]);

  const save = useCallback(async () => {
    setLoading(true);
    const body = JSON.stringify({ payload: form.values, type: 'public-logs-subscription' });
    const response = await Ajax.put(`/v1/server/${serverId}/setting`, body);
    setLoading(false);

    setError(null);
    if (response.error) {
      setError(response.error);
      showNotification({
        title: 'An error occurred while saving subscription',
        message: response.error,
      });
      return false;
    }
    showNotification({
      title: 'Subscription',
      message: 'Subscription for logs was saved!',
    });
    return true;
  }, [form, serverId]);

  return { loading, error, form, save };
}
