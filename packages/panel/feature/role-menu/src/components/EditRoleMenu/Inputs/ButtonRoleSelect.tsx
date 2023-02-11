import { RoleMenu } from '@eve/core';
import { Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { FormattedRoles } from '../../../types';

type ButtonRoleSelectProps = {
  form: UseFormReturnType<RoleMenu>,
  formattedRoles: FormattedRoles[],
  index: number,
}

export default function ButtonRoleSelect({ form, index, formattedRoles }: ButtonRoleSelectProps) {
  return (
    <Select
      label={'Role'}
      data={formattedRoles}
      style={{ width: 'clamp(100px, 20%, 250px)' }}
      {...form.getInputProps(`entries.${index}.role`)}
    />
  );
}
