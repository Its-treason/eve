import { ReactElement, useRef, useState } from 'react';
import { TextInput } from '@mantine/core';
import useIdValidation from '../../../hooks/useIdValidation';
import {getHotkeyHandler} from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

export default function GoToUser(): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  const { valid, error } = useIdValidation(userId);

  return (
    <TextInput
      className={'width-100'}
      label="Edit another users settings:"
      placeholder='User Id'
      value={userId}
      onChange={(evt) => setUserId(evt.currentTarget.value)}
      error={error}
      ref={inputRef}
      onKeyDown={getHotkeyHandler([['enter', () => {
        if (document.activeElement === inputRef.current && valid && userId.length !== 0) {
          navigate(`/user/${userId}/home`);
          return;
        }
      }]])}
    />
  );
}
