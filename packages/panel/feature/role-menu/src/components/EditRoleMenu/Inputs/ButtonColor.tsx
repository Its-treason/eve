import { RoleMenu } from '@eve/core';
import { Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

const colors = [
  { value: '1', label: 'Primary' },
  { value: '2', label: 'Secondary' },
  { value: '3', label: 'Success' },
  { value: '4', label: 'Danger' },
];

type ButtonColorProps = {
  form: UseFormReturnType<RoleMenu>,
  index: number,
}

export default function ButtonColor({ form, index }: ButtonColorProps) {
  return (
    <Select
      data={colors}
      label={'Button Color'}
      style={{ width: '110px' }}
      {...form.getInputProps(`entries.${index}.color`)}
    />
  );
}
