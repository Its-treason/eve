import { ReactElement } from 'react';
import { Modal, Text, Title, Code, Space } from '@mantine/core';

interface PlaceholderLegendDialogProps {
  opened: boolean,
  close: () => void,
}

function TemplateLegendModal({ opened, close }: PlaceholderLegendDialogProps): ReactElement {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={'Template help'}
      size={'xl'}
    >
      <Text>
        In certain texts you can use Placeholder that are replaced to the specific value, when bot sends the a message.
        Mustache is used the render the templates. So all variables surrounded with <Code>{'{{'} {'}}'}</Code> will be
        replaced.
      </Text>
      <Space h={'md'} />
      <Text>
        Example:
        <br />
        <Code>Welcome {'{{ '} user.name {'}}'}#{'{{ '} user.discriminator {'}}'} to the Server!</Code>
        <br />
        will become:
        <br />
        <Code>Welcome SuperCoolUser#1337 to the Server!</Code>
      </Text>
      <Space h={'md'} />
      <Title order={5}>User</Title>
      <Text><Code>user</Code> Will become an @User (Mention) but without pinging the user.</Text>
      <Text><Code>user.name</Code> Name of the user</Text>
      <Text><Code>user.discriminator</Code> The 4 digits at the end of all users</Text>
      <Text><Code>user.id</Code> The unique Id of a user</Text>
      <Title order={5} mt={8}>Server</Title>
      <Text><Code>server.name</Code> Name of the Server</Text>
      <Text><Code>server.id</Code> Unique id of the Server</Text>
      <Text><Code>server.memberCount</Code> Member Count, might not be always accurate</Text>
    </Modal>
  );
}

export default TemplateLegendModal;
