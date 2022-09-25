import { ReducedEmbed } from '@eve/types/api';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { ActionIcon, Button, Card, Checkbox, ColorInput, createStyles, Group, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { Plus, Trash } from 'tabler-icons-react';

type EmbedBuilderProps = {
  embed: ReducedEmbed,
  onChange: (embed: ReducedEmbed, isValid: boolean) => void,
}

export default function EmbedBuilder({ embed, onChange }: EmbedBuilderProps) {
  const form = useForm({
    initialValues: embed,
    validateInputOnChange: true,
    validate: {
      // See https://discord.com/developers/docs/resources/channel#embed-object-embed-limits
      title: (value) => value.length >= 256,
      description: (value) => value.length >= 4096,
      color: (value) => !(/^#([0-9a-fA-F]{3}){1,2}$/.test(value)),
      footer: (value) => value.length >= 2048,
      fields: {
        inline: (value) => typeof value === 'boolean',
        name: (value) => value.length >= 256,
        value: (value) => value.length >= 1024,
      },
    }
  });

  useEffect(() => {
    onChange(form.values, form.isValid())
  }, [form.values]);

  const fields = form.values.fields.map((_field, index) => {
    return (
      <Stack key={index} spacing={0} mt={'md'}>
        <Group>
          <TextInput
            withAsterisk
            label={'Name'}
            sx={{ flex: 1 }}
            {...form.getInputProps(`fields.${index}.name`)}
          />
          <Checkbox
            label={'Inline'}
            mt={20}
            {...form.getInputProps(`fields.${index}.inline`, { type: 'checkbox' })}
          />
          <ActionIcon
            variant={'light'}
            color={'red'}
            size={'lg'}
            mt={20}
            onClick={() => {
              form.removeListItem('fields', index);
            }}
          >
            <Trash />
          </ActionIcon>
        </Group>
        <Textarea
          withAsterisk
          label={'Value'}
          {...form.getInputProps(`fields.${index}.value`)}
        />
      </Stack>
    );
  });

  return (
    <Card sx={(theme) => ({ background: theme.colors.dark[7] })}>
      <Card.Section p={'md'}>
        <TextInput
          withAsterisk
          label={'Title'}
          {...form.getInputProps('title')}
        />
        <ColorInput
          withAsterisk
          label={'Color'}
          {...form.getInputProps('color')}
        />
        <Textarea
          withAsterisk
          label={'Description'}
          {...form.getInputProps('description')}
        />
        <TextInput
          withAsterisk
          label={'Footer'}
          {...form.getInputProps('footer')}
        />
      </Card.Section>
      <Card.Section p={'md'}>
        <Button
          onClick={() => form.insertListItem('fields', { name: '', value: '', inline: false })}
          disabled={form.values.fields.length >= 25}
          leftIcon={<Plus />}
        >Add field</Button>
        {fields}
      </Card.Section>
    </Card>
  );
}
