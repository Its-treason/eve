import { RoleMenu } from '@eve/core';
import { TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

type ButtonLabelProps = {
  form: UseFormReturnType<RoleMenu>,
  index: number,
}

export default function ButtonLabel({ form, index }: ButtonLabelProps) {
  return (
    <TextInput
      required
      label={'Button label'}
      sx={{ flex: 1 }}
      {...form.getInputProps(`entries.${index}.label`)}
    />
  );
}
