import { RoleMenu } from '../../../../sharedApiTypes';
import {
  APIActionRowComponent,
  APIButtonComponentWithCustomId,
  ButtonStyle,
  ComponentType,
} from 'discord-api-types/payloads/v9/channel';
import { ApiClient } from '../../../../../structures/ApiClient';
import { APIMessage } from 'discord-api-types/v9';
import getApiClient from '../../../../../structures/getApiClient';

interface MessageOptions {
  message: string,
  components: APIActionRowComponent[],
}

export default async function createRoleMenuMessage(roleMenu: RoleMenu): Promise<string> {
  const api = await getApiClient();
  
  const message = await fetchMessage(roleMenu.messageId, roleMenu.channelId, api);
  const messageOptions = createMessageOptions(roleMenu);

  if (!message) {
    return await createNewMessage(messageOptions, roleMenu, api);
  }

  return await editExistingMessage(roleMenu.channelId, messageOptions, message, api);
}

async function editExistingMessage(
  channelId: string,
  options: MessageOptions,
  message: APIMessage,
  api: ApiClient,
): Promise<string> {
    await api.editMessage(channelId, message.id,{
      'allowed_mentions': {
        users: [],
        roles: [],
      },
      content: options.message,
      components: options.components,
    });

  return message.id;
}

async function createNewMessage(options: MessageOptions, roleMenu: RoleMenu, api: ApiClient): Promise<string> {
  const channel = await api.getChannel(roleMenu.channelId);
  if (channel === null) {
    return '';
  }

  const message = await api.sendMessage(roleMenu.channelId, {
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

function createMessageOptions(roleMenu: RoleMenu): MessageOptions {
  const components: APIActionRowComponent[] = [];
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

    if (entry.emoji !== '') {
      button.emoji = { name: entry.emoji };
    }

    components.at(-1)?.components.push(button);
  });

  return {
    components,
    message: roleMenu.message.length !== 0 ? roleMenu.message : ' ',
  };
}

async function fetchMessage(messageId: string, channelId: string, api: ApiClient): Promise<false|APIMessage> {
  if (messageId === '') {
    return false;
  }

  const channel = await api.getChannel(channelId);
  if (channel === null) {
    return false;
  }

  const message = await api.getMessage(channelId, messageId);
  if (message === null) {
    return false;
  }

  return message;
}
