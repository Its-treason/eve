import { BasicServerInfoApiResponseData, ReducedChannel, RoleListApiResponseData } from '@eve/types/api';
import { EmojiContextType } from '../context/EmojiContext';
import Ajax from './Ajax';

export async function getBasicServerInfo(serverId: string, apiKey: string): Promise<BasicServerInfoApiResponseData|string> {
  const response = await Ajax.get<BasicServerInfoApiResponseData>(`/v1/server/${serverId}/basicInfo`, {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }
  return response.data;
}

export async function getRoles(serverId: string, apiKey: string): Promise<RoleListApiResponseData|string> {
  const response = await Ajax.get<RoleListApiResponseData>(`/v1/server/${serverId}/roleList`, {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }
  return response.data;
}

export async function getEmojis(serverId: string, apiKey: string, abortController: AbortController): Promise<EmojiContextType|string> {
  const response = await Ajax.get<EmojiContextType>(`/v1/server/${serverId}/emojiList`, {}, apiKey, abortController);

  if (response.error !== null) {
    return response.error;
  }
  return response.data;
}

export async function getChannel(serverId: string, apiKey: string): Promise<ReducedChannel[]|string> {
  const response = await Ajax.get<ReducedChannel[]>(`/v1/server/${serverId}/channelList`, {}, apiKey);

  if (response.error !== null) {
    return response.error;
  }
  return response.data;
}
