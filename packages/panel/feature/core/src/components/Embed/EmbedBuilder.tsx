'use client';

import { ReducedEmbed } from '@eve/types/api';
import { useEffect } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { ActionIcon, Button, Card, Checkbox, ColorInput, Group, Stack, Textarea, TextInput } from '@mantine/core';
import { Plus, Trash } from 'tabler-icons-react';
import { z } from 'zod';
import DisplayEmbedError from './DisplayEmbedError';

const schema = z.object({
  title: z.string().max(256),

  description: z.string().max(4096),

  color: z.string().refine((value) => /^#([0-9a-fA-F]{3}){1,2}$/i.test(value)),

  footer: z.string().max(2048),

  fields: z.array(z.object({
    name: z.string().max(256),

    value: z.string().max(1024),

    inline: z.boolean(),
  })),
}).superRefine((embed, ctx) => {
  let characterCount = 0;

  characterCount += embed.description.length;
  characterCount += embed.title.length;
  characterCount += embed.footer.length;
  for (const field of embed.fields) {
    characterCount += field.name.length;
    characterCount += field.value.length;
  }

  if (characterCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 1,
      type: 'string',
      inclusive: true,
      message: 'Embed must not be empty',
      fatal: true,
    });
  }
  if (characterCount > 5900) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 5900,
      type: 'string',
      inclusive: true,
      message: 'Length of all Embed fields must not be greater then 5900 characters',
      fatal: true,
    });
  }
});

type EmbedBuilderProps = {
  embed: ReducedEmbed,
  onChange: (embed: ReducedEmbed, isValid: boolean) => void,
}

export default function EmbedBuilder({ embed, onChange }: EmbedBuilderProps) {
  const form = useForm({
    initialValues: embed,
    validateInputOnBlur: true,
    validate: zodResolver(schema),
  });

  useEffect(() => {
    onChange(form.values, form.isValid());
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
        <DisplayEmbedError form={form} />
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
