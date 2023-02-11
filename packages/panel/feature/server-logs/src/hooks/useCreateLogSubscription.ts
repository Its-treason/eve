import { loadSetting, saveSetting } from '@eve/panel/feature/core';
import { useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
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
    const apiKey = String(getCookie('apiKey'));
    const abortController = new AbortController();

    (async () => {
      setLoading(true);
      const result = await loadSetting('public-logs-subscription', serverId, apiKey, abortController);
      setLoading(false);
      if (typeof result === 'string') {
        setError(result);
        return;
      }

      setError(null);
      form.setValues(result);
      form.resetDirty();
    })();

    return () => {
      abortController.abort();
    };
  }, [serverId]);

  const save = useCallback(async () => {
    const apiKey = String(getCookie('apiKey'));

    setLoading(true);
    const result = await saveSetting('public-logs-subscription', serverId, form.values, apiKey);
    setLoading(false);

    setError(null);
    if (result !== true) {
      setError(result);
      showNotification({
        title: 'An error occurred while saving subscription',
        message: result,
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
