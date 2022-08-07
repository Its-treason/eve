import React from 'react';
import { ReducedEmoji } from '../api/sharedApiTypes';

export type EmojiContextType = { 
  guildEmojis: ReducedEmoji[],
  generalEmojis: ReducedEmoji[],
}

const EmojiContext = React.createContext<EmojiContextType>({ guildEmojis: [], generalEmojis: [] });

export default EmojiContext;
