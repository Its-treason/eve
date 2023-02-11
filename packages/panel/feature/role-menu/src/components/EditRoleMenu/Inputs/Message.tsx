import { RoleMenu } from '@eve/core';
import { Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

type MessageProps = {
  form: UseFormReturnType<RoleMenu>,
}

export default function Message({ form }: MessageProps) {
  return (
    <Textarea
      label={'Message'}
      {...form.getInputProps('message')}
    />
  );
}
