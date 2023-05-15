'use client';

import { useEffect, useState } from 'react';
import Ajax from '../api/Ajax';
import { EmojiContextType } from '../context/EmojiContext';

export default function useEmojis(serverId: string): EmojiContextType {
  const [emojis, setEmojis] = useState<EmojiContextType>({ guildEmojis: [], generalEmojis: [] });

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      const response = await Ajax.get<EmojiContextType>(
        `/v1/server/${serverId}/emojiList`,
        {},
        { signal: abortController.signal },
      );
      if (!response.data) {
        throw new Error(response.error);
      }
      setEmojis(response.data);
    })();

    return () => {
      abortController.abort();
    };
  }, [serverId]);

  return emojis;
}
