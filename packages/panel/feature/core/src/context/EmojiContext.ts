import { ReducedEmoji } from '@eve/types/api';
import React from 'react';

export type EmojiContextType = { 
  guildEmojis: ReducedEmoji[],
  generalEmojis: ReducedEmoji[],
}

const EmojiContext = React.createContext<EmojiContextType>({ guildEmojis: [], generalEmojis: [] });

export default EmojiContext;
