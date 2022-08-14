import { APIActionRowComponent, APIButtonComponentWithCustomId, APIMessage, APIMessageActionRowComponent, ButtonStyle, ComponentType } from 'discord-api-types/v9';
import { ApiClient, RoleMenu } from '@eve/core';
import { injectable } from 'tsyringe';

type MessageOptions = {
  message: string,
  components: APIActionRowComponent<APIMessageActionRowComponent>[],
}

@injectable()
export default class RoleMenuService {
  constructor(
    private apiClient: ApiClient,
  ) {}

  public async createRoleMenuMessage(roleMenu: RoleMenu): Promise<string> {
    const message = await this.fetchMessage(roleMenu.messageId, roleMenu.channelId);
    const messageOptions = this.createMessageOptions(roleMenu);

    if (!message) {
      return await this.createNewMessage(messageOptions, roleMenu);
    }

    return await this.editExistingMessage(roleMenu.channelId, messageOptions, message);
  }

  private async editExistingMessage(
    channelId: string,
    options: MessageOptions,
    message: APIMessage,
  ): Promise<string> {
    await this.apiClient.editMessage(channelId, message.id, {
      'allowed_mentions': {
        users: [],
        roles: [],
      },
      content: options.message,
      components: options.components,
    });

    return message.id;
  }

  private async createNewMessage(options: MessageOptions, roleMenu: RoleMenu): Promise<string> {
    const channel = await this.apiClient.getChannel(roleMenu.channelId);
    if (channel === null) {
      return '';
    }

    const message = await this.apiClient.sendMessage(roleMenu.channelId, {
      'allowed_mentions': {
        users: [],
        roles: [],
      },
      content: options.message,
      components: options.components,
    });
    if (!message) {
      return '';
    }

    return message.id;
  }

  private createMessageOptions(roleMenu: RoleMenu): MessageOptions {
    const components: APIActionRowComponent<APIMessageActionRowComponent>[] = [];
    roleMenu.entries.forEach((entry, index) => {
      if (index % 5 === 0) {
        components.push({ components: [], type: ComponentType.ActionRow });
      }

      const button: APIButtonComponentWithCustomId = {
        type: ComponentType.Button,
        label: entry.label,
        style: ButtonStyle.Primary,
        'custom_id': `menu-${roleMenu.id}-${entry.role}-${index}`,
      };

      if (entry.emoji) {
        // For reasons APIMessageComponentEmoji and ApiPartialEmoji are inkompatible
        button.emoji = {
          name: entry.emoji.name || undefined,
          id: entry.emoji.id || undefined,
          animated: entry.emoji.animated,
        };
      }

      components.at(-1)?.components.push(button);
    });
  
    return {
      components,
      message: roleMenu.message.length !== 0 ? roleMenu.message : ' ',
    };
  }

  private async fetchMessage(messageId: string, channelId: string): Promise<false|APIMessage> {
    if (messageId === '') {
      return false;
    }

    const channel = await this.apiClient.getChannel(channelId);
    if (channel === null) {
      return false;
    }
  
    const message = await this.apiClient.getMessage(channelId, messageId);
    if (message === null) {
      return false;
    }
  
    return message;
  }

  async deleteMessage(roleMenu: RoleMenu): Promise<void> {
    if (roleMenu.messageId === '') {
      return;
    }
  
    const channel = await this.apiClient.getChannel(roleMenu.channelId);
    if (channel === null) {
      return;
    }
  
    const message = await this.apiClient.getMessage(channel.id, roleMenu.messageId);
    if (message === null) {
      return;
    }
  
    await this.apiClient.deleteMessage(channel.id, message.id);
  }
}
