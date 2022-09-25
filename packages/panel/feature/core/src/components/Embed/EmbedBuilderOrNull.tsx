import { ReducedEmbed } from '@eve/types/api';
import { Group, Stack, Switch, Text } from '@mantine/core';
import { useCallback } from 'react';
import EmbedBuilder from './EmbedBuilder';

type EmbedBuilderOrNullProps = {
  value: ReducedEmbed|null,
  onChange: (embed: ReducedEmbed|null, isValid: boolean) => void,
}

export default function EmbedBuilderOrNull({ value, onChange }: EmbedBuilderOrNullProps) {
  const handleChange = useCallback(() => {
    if (value !== null) {
      onChange(null, true);
      return;
    }

    onChange({
      color: '#0000FF',
      description: '',
      footer: '',
      title: '',
      fields: [],
    }, false);
  }, [value])

  return (
    <Stack>
      <Group>
        <Text>Embed</Text>
        <Switch
          label={'Use embed'}
          checked={value !== null}
          onChange={handleChange}
        />
      </Group>
      {value !== null && (
        <EmbedBuilder embed={value} onChange={onChange} />
      )}
    </Stack>
  )
}
