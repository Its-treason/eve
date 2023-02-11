import { RoleMenu } from '@eve/core';
import { EmbedBuilderOrNull } from '@eve/panel/feature/core';
import { ReducedEmbed } from '@eve/types/api';
import { UseFormReturnType } from '@mantine/form';
import { useCallback } from 'react';

type EmbedProps = {
  form: UseFormReturnType<RoleMenu>,
}

export default function Embed({ form }: EmbedProps) {
  const handleChange = useCallback((value: ReducedEmbed|null, valid: boolean) => {
    form.setFieldValue('embed', value);
    if (valid) {
      form.clearFieldError('embed');
      return;
    }
    form.setFieldError('embed', 'Embed is Invalid');
  }, [form]);

  return (
    <EmbedBuilderOrNull
      value={form.values.embed}
      onChange={handleChange}
    />
  );
}
