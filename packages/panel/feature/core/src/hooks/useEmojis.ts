import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { getEmojis } from '../api/ServerApi';
import { EmojiContextType } from '../context/EmojiContext';

export default function useEmojis(serverId: string): EmojiContextType {
  const [emojis, setEmojis] = useState<EmojiContextType>({ guildEmojis: [], generalEmojis: [] });

  useEffect(() => {
    const apiKey = String(getCookie('apiKey'));

    let abortController = new AbortController();

    (async () => {
      const emojiResult = await getEmojis(serverId, apiKey, abortController);
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
