import { ReducedEmoji } from '@eve/types/api';
import { Image, Tooltip } from '@mantine/core';
import { ReactElement } from 'react';

type DisplayEmojiProps = {
  emoji?: ReducedEmoji,
}

export default function DisplayEmoji({ emoji }: DisplayEmojiProps): ReactElement {
  if (!emoji) {
    return <></>;
  }

  if (emoji.id === null) {
    // This a default emoji, to tooltip needed
    return <div style={{ height: 24, width: 24, textAlign: 'center', fontSize: 19 }}>{emoji.name}</div>;
  }

  if (emoji.animated) {
    return (
      <Tooltip label={`:${emoji.name}:`} sx={{border: '1px solid #4d4f66'}}>
        <Image
          height={24}
          width={24}
          src={`https://cdn.discordapp.com/emojis/${emoji.id}.gif?size=32&quality=lossless`}
        />
      </Tooltip>
    )
  }

  return (
    <Tooltip label={`:${emoji.name}:`} sx={{border: '1px solid #4d4f66'}}>
      <Image
        height={24}
        width={24}
        src={`https://cdn.discordapp.com/emojis/${emoji.id}.webp?size=32&quality=lossless`}
      />
    </Tooltip>
  )
}
