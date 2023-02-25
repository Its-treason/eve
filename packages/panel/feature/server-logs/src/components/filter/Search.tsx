import { TextInput } from '@mantine/core';
import { ReactElement } from 'react';

type SearchProps = {
  search: string,
  setSearch: (search: string) => void,
}

export default function Search({ search, setSearch }: SearchProps): ReactElement {
  return (
    <TextInput 
      value={search}
      placeholder={'Log message...'}
      onChange={(evt) => setSearch(evt.currentTarget.value)}
      label={'Search for message'}
    />
  );
}
