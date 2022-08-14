import { useEffect, useState } from 'react';
import ServerApi from '../api/ServerApi';
import { EmojiContextType } from '../context/EmojiContext';

export default function useEmojis(serverId: string): EmojiContextType {
  const [emojis, setEmojis] = useState<EmojiContextType>({ guildEmojis: [], generalEmojis: [] });

  useEffect(() => {
    if (serverId === '') {
      return;
    }

    let abortController = new AbortController();

    (async () => {
      const emojiResult = await ServerApi.getEmojis(serverId, abortController);
      if (typeof emojiResult === 'string') {
        throw new Error(emojiResult);
      }
      setEmojis(emojiResult);
    })();

    return () => {
      abortController.abort();
    }
  }, [serverId]);

  return emojis;
}
