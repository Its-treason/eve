import { RoleMenu } from '@eve/core'
import { EmojiPicker } from '@eve/panel/feature/core';
import { ReducedEmoji } from '@eve/types/api';
import { UseFormReturnType } from '@mantine/form'
import { useCallback } from 'react';

type ButtonEmojiProps = {
  form: UseFormReturnType<RoleMenu>,
  index: number,
}

export default function ButtonEmoji({ form, index }: ButtonEmojiProps) {
  const handleChange = useCallback((value: ReducedEmoji|undefined) => {
    form.setFieldValue(`entries.${index}.emoji`, value);
  }, [form]);

  return (
    <EmojiPicker
      emoji={form.values.entries[index].emoji}
      onChange={handleChange}
      clearable={true}
    />
  );
}
