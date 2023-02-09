import { RoleMenu } from '@eve/types/api';
import { Center, Group } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import AddRole from './Inputs/AddRoleButton';
import ButtonColor from './Inputs/ButtonColor';
import ButtonLabel from './Inputs/ButtonLabel';
import ButtonEmoji from './Inputs/ButtonEmoji';
import ButtonRoleSelect from './Inputs/ButtonRoleSelect';
import ButtonRemoveButton from './Inputs/ButtonRemoveButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'tabler-icons-react';

type SelectItem = {
  label: string,
  value: string,
}

type RoleMenuRoleListProps = {
  formattedRoles: SelectItem[],
  form: UseFormReturnType<RoleMenu>
}

export default function RoleMenuRoleList({ formattedRoles, form }: RoleMenuRoleListProps) {
  const fields = form.values.entries.map((_, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided) => (
        <Group ref={provided.innerRef} {...provided.draggableProps} mb={'xs'}>
          <Center {...provided.dragHandleProps} mt={20}>
            <GripVertical size={18} />
          </Center>
          <ButtonRoleSelect form={form} formattedRoles={formattedRoles} index={index} />
          <ButtonEmoji form={form} index={index} />
          <ButtonLabel form={form} index={index} />
          <ButtonColor form={form} index={index} />
          <ButtonRemoveButton form={form} index={index} />
        </Group>
      )}
    </Draggable>
  ));

  return (
    <>
      <AddRole form={form} />
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination) {
            return;
          }
          form.reorderListItem('entries', { from: source.index, to: destination.index })
        }}
      >
        <Droppable droppableId={`dnd-list-${form.values.id}`} direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
