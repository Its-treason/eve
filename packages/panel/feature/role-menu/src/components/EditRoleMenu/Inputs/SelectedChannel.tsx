import { RoleMenu } from '@eve/core'
import { ReducedChannel } from '@eve/types/api'
import { Code, TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { useMemo } from 'react'

type SelectedChannelProps = {
  form: UseFormReturnType<RoleMenu>,
  channel: ReducedChannel[],
}

export default function SelectedChannel({ form, channel }: SelectedChannelProps) {
  const selectedChannel = useMemo(() => {
    return channel.find(singleChannel => {
      return String(singleChannel.id) === form.values.channelId;
    });
  }, [form]);

  return (
    <TextInput
      readOnly
      label={'Channel'}
      defaultValue={selectedChannel !== undefined ? selectedChannel.name : 'N/A'}
      icon={<Code>#</Code>}
    />
  )
}
