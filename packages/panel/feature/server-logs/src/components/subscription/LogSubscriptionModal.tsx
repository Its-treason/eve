import { useServerChannel } from '@eve/panel/feature/core';
import { Button, Checkbox, Modal, MultiSelect, Select, Stack, Text, TextInput } from '@mantine/core'
import { DeviceFloppy } from 'tabler-icons-react';
import useCreateLogSubscription from '../../hooks/useCreateLogSubscription'

type LogSubscriptionModalProps = {
  serverId: string,
  opened: boolean,
  close: () => void,
}

const availableCategories = [
  { label: 'CommandUsed', value: 'command_used' },
  { label: 'ModerationCommandUsed', value: 'moderation_command_used' },
  { label: 'AutoActionExecuted', value: 'auto_action_executed' },
  { label: 'SettingChanged', value: 'setting_changed' },
  { label: 'ErrorOccurred', value: 'error_occurred' },
];

export default function LogSubscriptionModal({ serverId, opened, close }: LogSubscriptionModalProps) {
  const {
    error, form, save
  } = useCreateLogSubscription(serverId);
  const { channel } = useServerChannel(serverId, 'text');

  return (
    <Modal opened={opened} onClose={close} title={'Create logs subscription'}>
      <Stack>
        <Text>EVE can mirror its logs into a channel. Select a channel and categories to get started.</Text>
        <MultiSelect
          label={'Categories to subscribe to'}
          data={availableCategories}
          style={{ width: '100%' }}
          {...form.getInputProps('wantedCategories')}
        />
        <Select
          label={'Channel'}
          style={{ width: '100%' }}
          data={channel.map((channel) => {
            return {
              label: `#${channel.name}`,
              value: channel.id,
            }
          })}
          {...form.getInputProps('channel')}
        />
        <Checkbox
          label={'Enabled'}
          {...form.getInputProps('enabled', { type: 'checkbox' })}
        />
        <Button
          onClick={() => save().then((success) => success && close())}
          leftIcon={<DeviceFloppy />}
        >Save</Button>
        {error}
      </Stack>
    </Modal>
  );
}
