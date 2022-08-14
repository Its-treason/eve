import { ApiClient } from '@eve/core';
import { singleton } from 'tsyringe';
import { ReducedEmoji } from '../Web/sharedApiTypes';

@singleton()
export default class EmojiService {
  private readonly generalEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊',
    '😇', '🥰', '😍', '🤩', '😘', '😗', '☺', '😚', '😙', '🥲', '😋', '😛',
  ];

  constructor(
    private apiClient: ApiClient,
  ) {}

  public async getGuildEmojis(guildId: string): Promise<ReducedEmoji[]> {
    const allEmojis = await this.apiClient.getEmojis(guildId);
    if (allEmojis === null) {
      return [];
    }

    return allEmojis.reduce<ReducedEmoji[]>((acc ,emoji) => {
      if (emoji.available && emoji.name) {
        acc.push({
          id: emoji.id,
          name: emoji.name,
          animated: emoji.animated,
        });
      }

      return acc;
    }, []);
  }

  public async getGeneralEmojis(): Promise<ReducedEmoji[]> {
    return this.generalEmojis.map((emoji) => {
      return {
        name: emoji,
        id: null,
      };
    });
  }

  public async validateEmoji(emoji: ReducedEmoji, guildId: string): Promise<boolean> {
    if (emoji.id === null && emoji.name !== null) {
      return this.generalEmojis.includes(emoji.name);
    }

    const guildEmojis = await this.getGuildEmojis(guildId);
    for (const guildEmoji of guildEmojis) {
      if (guildEmoji.id === emoji.id) {
        return true;
      }
    }

    return false;
  }
}
