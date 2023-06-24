'use client';

import { ReducedEmbed } from '@eve/types/api';
import { Group, Stack, Switch, Text, Textarea } from '@mantine/core';
import { useCallback } from 'react';
import EmbedBuilder from './EmbedBuilder';

type EmbedBuilderOrTextProps = {
  value: ReducedEmbed | string,
  onChange: (embed: ReducedEmbed | string, isValid: boolean) => void,
}

export default function EmbedBuilderOrText({ value, onChange }: EmbedBuilderOrTextProps) {
  const handleChange = useCallback(() => {
    if (typeof value !== 'string') {
      onChange('', true);
      return;
    }

    onChange({
      color: '#0000FF',
      description: '',
      footer: '',
      title: '',
      fields: [],
    }, true);
  }, []);

  return (
    <Stack w={'100%'}>
      <Group position={'apart'}>
        <Text>Message</Text>
        <Switch
          label={'Use embed'}
          checked={typeof value !== 'string'}
          onChange={handleChange}
        />
      </Group>
      {typeof value === 'string' ? (
        <Textarea 
          value={value}
          onChange={(evt) => onChange(evt.currentTarget.value, true)}
          autosize
          minRows={2}
          maxRows={6}
        />
      ) : (
        <EmbedBuilder embed={value} onChange={onChange} />
      )}
    </Stack>
  );
}
