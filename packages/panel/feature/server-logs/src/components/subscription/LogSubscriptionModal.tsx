import { useServerChannel } from '@eve/panel/feature/core';
import { Button, Checkbox, Modal, MultiSelect, Select, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import useCreateLogSubscription from '../../hooks/useCreateLogSubscription';

type LogSubscriptionModalProps = {
  serverId: string,
  opened: boolean,
  close: () => void,
}

const availableCategories = [
  'CommandUsed',
  'ModerationCommandUsed',
  'AutoActionExecuted',
  'SettingChanged',
  'ErrorOccurred',
  'NativeModerationAction',
];

export default function LogSubscriptionModal({ serverId, opened, close }: LogSubscriptionModalProps) {
  const {
    error, form, save, loading,
  } = useCreateLogSubscription(serverId);
  const { channel } = useServerChannel(serverId, 'text');

  const channelSelectData = useMemo(() => {
    return channel.map((channel) => {
      return {
        label: `#${channel.name}`,
        value: channel.id,
      };
    });
  }, [channel]);

  return (
    <Modal opened={opened} onClose={close} title={'Create logs subscription'}>
      <Stack>
        <Text>EVE can mirror its logs into a channel. Select a channel and categories to get started.</Text>
        <MultiSelect
          label={'Categories to subscribe to'}
          data={availableCategories}
          style={{ width: '100%' }}
          disabled={loading}
          {...form.getInputProps('wantedCategories')}
        />
        <Select
          label={'Channel'}
          style={{ width: '100%' }}
          data={channelSelectData}
          disabled={loading}
          {...form.getInputProps('channel')}
        />
        <Checkbox
          label={'Enabled'}
          disabled={loading}
          {...form.getInputProps('enabled', { type: 'checkbox' })}
        />
        <Button
          onClick={() => save().then((success) => success && close())}
          disabled={loading}
          loading={loading}
          leftIcon={<DeviceFloppy />}
        >Save</Button>
        {error}
      </Stack>
    </Modal>
  );
}

