import { ReactElement, useState } from 'react';
import useCreateRoleMenu from '../hooks/useCreateRoleMenu';
import { Button, Text, Select, TextInput, Modal, Group } from '@mantine/core';
import { useServerChannel } from '@eve/panel/feature/core';

interface CreateRoleMenuProps {
  opened: boolean,
  serverId: string,
  close: (updateRoleMenus: boolean) => void,
}

function CreateRoleMenu({ opened, close, serverId }: CreateRoleMenuProps): ReactElement {
  const [name, setName] = useState('');
  const [channelId, setChannelId] = useState('');

  const { channel } = useServerChannel(serverId, 'text');
  const { createRoleMenuError, createRoleMenu, createRoleMenuLoading } = useCreateRoleMenu(serverId);

  const formattedChannel = channel.map(channel => {
    return { label: channel.name, value: channel.id };
  });

  function cancelCreate() {
    close(false);
    setName('');
    setChannelId('');
  }

  const disableCreate = createRoleMenuLoading || name.trim().length === 0 || channelId === '';

  return (
    <Modal opened={opened} onClose={cancelCreate} title={'Create role menu'}>
      <Group>
        <TextInput
          label={'Name'}
          disabled={createRoleMenuLoading}
          width={'100%'}
          onChange={evt => setName(evt.currentTarget.value)}
          value={name}
          style={{ width: '100%' }}
        />
        <Select
          data={formattedChannel}
          value={channelId}
          label={'Channel'}
          disabled={createRoleMenuLoading}
          onChange={value => {
            setChannelId(value || '');
          }}
          style={{ width: '100%' }}
        />
        <Text color={'red'}>{createRoleMenuError}</Text>
        <Button
          ml={'auto'}
          variant={'subtle'}
          color={'red'}
          disabled={createRoleMenuLoading}
          onClick={cancelCreate}
        >Cancel</Button>
        <Button
          disabled={disableCreate}
          onClick={() => createRoleMenu(name, channelId).then(result => {
            if (result) {
              close(true);
              setName('');
              setChannelId('');
            }
          })}
        >Create</Button>
      </Group>
    </Modal>
  );
}

export default CreateRoleMenu;
