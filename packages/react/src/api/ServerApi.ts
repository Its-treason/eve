import {BasicServerInfoApiResponseData, ReducedChannel, RoleListApiResponseData} from './sharedApiTypes';
import Ajax from './Ajax';
import { EmojiContextType } from '../context/EmojiContext';

export default class ServerApi {
  public static async getBasicInfo(serverId: string): Promise<BasicServerInfoApiResponseData|false> {
    const response = await Ajax.get(`/v1/server/${serverId}/basicInfo`);

    if (response.code !== 200) {
      return false;
    }

    return response.data.data;
  }

  public static async getRoles(serverId: string): Promise<RoleListApiResponseData|string> {
    const response = await Ajax.get(`/v1/server/${serverId}/roleList`);

    if (response.code !== 200) {
      return response.data!.error || 'Unknown error fetching roles';
    }

    return response.data.data;
  }

  public static async getEmojis(serverId: string, abortController: AbortController): Promise<EmojiContextType|string> {
    const response = await Ajax.get(`/v1/server/${serverId}/emojiList`, abortController);

    if (response.code !== 200) {
      return response.data!.error || 'Unknown error fetching roles';
    }

    return response.data.data;
  }

  public static async getChannel(serverId: string): Promise<ReducedChannel[]|string> {
    const response = await Ajax.get(`/v1/server/${serverId}/channelList`);

    if (response.code !== 200) {
      return response.data!.error || 'Unknown error fetching channel';
    }

    return response.data.data;
  }
}
