import {ReactElement} from "react";
import {Modal, Text, Title, Code, Space} from "@mantine/core";

interface PlaceholderLegendDialogProps {
  opened: boolean,
  close: () => void,
}

function TemplateLegendDialog({opened, close}: PlaceholderLegendDialogProps): ReactElement {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={'Template help'}
      size={'xl'}
    >
      <Text>
        In certain texts you can use Placeholder that are replaced to the specific value, when bot sends the a message.
      </Text>
      <Text>
        Mustache is used the render the templates. So all variables surrounded with
        <Code>{'{{'} {'}}'}</Code> will be replaced. For example <Code>Welcome {'{{ '}
        user.name {'}}'} to the Server!</Code> will become <Code>Welcome MySuperCoolServer to the Server!</Code>.
      </Text>
      <Space h={'md'} />
      <Title order={5}>User</Title>
      <Text><Code>user</Code> Will become an @User (Ping). Note that the User will not be pinged</Text>
      <Text><Code>user.name</Code> Name of the user</Text>
      <Text><Code>user.discriminator</Code> The 4 digits at the end of all users</Text>
      <Text><Code>user.id</Code> The unique Id of a user</Text>
      <Title order={5}>Server</Title>
      <Text><Code>server.name</Code> Name of the Server</Text>
      <Text><Code>server.id</Code> Unique id the Server</Text>
      <Text><Code>server.memberCount</Code> Member Count, might not be always accurate</Text>
    </Modal>
  )
}

export default TemplateLegendDialog;
