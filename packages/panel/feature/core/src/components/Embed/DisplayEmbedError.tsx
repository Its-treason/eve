import { ReducedEmbed } from '@eve/types/api';
import { Alert } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { AlertCircle } from 'tabler-icons-react';

type DisplayEmbedErrorProps = {
  form: UseFormReturnType<ReducedEmbed>,
}

export default function DisplayEmbedError({ form }: DisplayEmbedErrorProps) {
  if (form.isValid()) {
    return null;
  }

  let characterCount = 0;
  characterCount += form.values.description.length;
  characterCount += form.values.title.length;
  characterCount += form.values.footer.length;
  for (const field of form.values.fields) {
    characterCount += field.name.length;
    characterCount += field.value.length;
  }

  if (characterCount === 0) {
    return (
      <Alert icon={<AlertCircle size={16} />} title="Validation" color="red">
        The embed must contain at least one character, in one field
      </Alert>
    );
  }
  if (characterCount > 5900) {
    return (
      <Alert icon={<AlertCircle size={16} />} title="Validation" color="red">
        The total character count of all embed fields must not be greater than 5900
      </Alert>
    );
  }

  return null;
}
