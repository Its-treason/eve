import { Button, Checkbox, Group, Textarea, Text, Code, Anchor, Select } from '@mantine/core';
import { EmbedBuilderOrNull, useServerChannel } from '@eve/panel/feature/core';
import useAutoActionsForm from '../hooks/useAutoActionsForm';
import { z } from 'zod';
import { ReducedEmbed } from '@eve/core';

type LeaveMessagePayload = {
  message: string,
  enabled: boolean,
  channel: string,
  embed: ReducedEmbed | null,
}

type LeaveMessageProps = {
  serverId: string,
  openDocs: () => void,
}

const schema = z.object({
  message: z.string().min(1),
  channel: z.string().min(1),
  enabled: z.boolean(),
});

const initialValues = {
  message: '',
  channel: '',
  enabled: false,
  embed: null,
};

function LeaveMessage({ serverId, openDocs }: LeaveMessageProps) {
  const {
    error, form, loading: actionLoading, save,
  } = useAutoActionsForm<LeaveMessagePayload, typeof schema>('leave-message', serverId, initialValues, schema);
  const { channel, channelLoading } = useServerChannel(serverId, 'text');

  const loading = actionLoading || channelLoading;

  return (
    <Group>
      <Text>A message that is automatically send when a member leaves the Server!</Text>
      <Text>
        Available template objects are: <Code>user</Code> & <Code>guild</Code>.
        Click <Anchor onClick={openDocs}>here</Anchor> for help about templates.
      </Text>
      <Textarea
        label="Message"
        autosize
        minRows={2}
        maxRows={6}
        disabled={loading}
        style={{ width: '100%' }}
        {...form.getInputProps('message')}
      />
      <EmbedBuilderOrNull
        value={form.values.embed}
        onChange={(embed) => form.setFieldValue('embed', embed)}
      />
      <Select
        label={'Channel'}
        style={{ width: '100%' }}
        data={channel.map((channel) => {
          return {
            label: `#${channel.name}`,
            value: channel.id,
          };
        })}
        {...form.getInputProps('channel')}
      />
      <Checkbox
        label="Enabled"
        disabled={loading}
        style={{ width: '100%' }}
        {...form.getInputProps('enabled', { type: 'checkbox' })}
      />
      <Button
        fullWidth
        disabled={!form.isValid()}
        onClick={save}
      >Save Leave Message</Button>
      <Text color={'red'}>{error}</Text>
    </Group>
  );
}

export default LeaveMessage;
