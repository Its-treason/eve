import { RoleMenu } from '@eve/core'
import { Select, Textarea } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { type } from 'os'
import { FormattedRoles } from '../../../types'

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
      style={{width: 'clamp(100px, 20%, 250px)'}}
      {...form.getInputProps(`entries.${index}.role`)}
    />
  );
}
