import { useEffect, useState } from 'react';
import { getChannel } from '../api/ServerApi';
import { getCookie } from 'cookies-next';
import { ReducedChannel } from '@eve/types/api';

interface UseServerChannelData {
  channel: ReducedChannel[],
  channelLoading: boolean,
  channelError: string|null,
  fetchChannel: () => Promise<void>,
}

function useServerChannel(serverId: string, type?: 'text'|'voice'): UseServerChannelData {
  const [channel, setChannel] = useState<ReducedChannel[]>([]);
  const [channelLoading, setChannelLoading] = useState(true);
  const [channelError, setChannelError] = useState<string|null>(null);

  async function fetchChannel() {
    setChannelLoading(true);

    const apiKey = String(getCookie('apiKey'));

    let newChannel = await getChannel(serverId, apiKey);

    if (typeof newChannel === 'string') {
      setChannelError(newChannel);
      setChannelLoading(false);
      return;
    }

    if (type) {
      newChannel = newChannel.filter(channel => channel.type === type);
    }

    setChannel(newChannel || []);
    setChannelError(null);
    setChannelLoading(false);
  }

  useEffect(() => {
    fetchChannel().catch((e) => {
      console.error('Error while fetching channel', e);
      setChannelError('An error occurred while fetching channel');
    });
  }, [serverId, type]);

  return {
    channel,
    channelError,
    channelLoading,
    fetchChannel,
  };
}

export default useServerChannel;
