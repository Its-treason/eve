import { RoleMenu } from '@eve/types/api';
import { Group } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import AddRole from './Inputs/AddRoleButton';
import ButtonColor from './Inputs/ButtonColor';
import ButtonLabel from './Inputs/ButtonLabel';
import ButtonEmoji from './Inputs/ButtonEmoji';
import ButtonRoleSelect from './Inputs/ButtonRoleSelect';
import ButtonRemoveButton from './Inputs/ButtonRemoveButton';

type SelectItem = {
  label: string,
  value: string,
}

type RoleMenuRoleListProps = {
  formattedRoles: SelectItem[],
  form: UseFormReturnType<RoleMenu>
}

export default function RoleMenuRoleList({ formattedRoles, form }: RoleMenuRoleListProps) {
  const rows = form.values.entries.map((_, index) => {
    return (
      <Group align={'flex-start'} key={index}>
        <ButtonRoleSelect form={form} formattedRoles={formattedRoles} index={index} />
        <ButtonEmoji form={form} index={index} />
        <ButtonLabel form={form} index={index} />
        <ButtonColor form={form} index={index} />
        <ButtonRemoveButton form={form} index={index} />
      </Group>
    );
  })

  return (
    <>
      <AddRole form={form} />
      {rows}
    </>
  );
}
