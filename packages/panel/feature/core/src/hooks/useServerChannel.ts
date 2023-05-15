'use client';

import { useEffect, useState } from 'react';
import { ReducedChannel } from '@eve/types/api';
import Ajax from '../api/Ajax';

interface UseServerChannelData {
  channel: ReducedChannel[],
  channelLoading: boolean,
  channelError: string | null,
  fetchChannel: () => Promise<void>,
}

function useServerChannel(serverId: string, type?: 'text' | 'voice'): UseServerChannelData {
  const [channel, setChannel] = useState<ReducedChannel[]>([]);
  const [channelLoading, setChannelLoading] = useState(true);
  const [channelError, setChannelError] = useState<string | null>(null);

  async function fetchChannel() {
    setChannelError(null);
    setChannelLoading(true);
    const response = await Ajax.get<ReducedChannel[]>(`/v1/server/${serverId}/channelList`);
    setChannelLoading(false);

    if (!response.data) {
      setChannelError(response.error);
      return;
    }

    let newChannel = response.data;
    if (type) {
      newChannel = newChannel.filter(channel => channel.type === type);
    }

    setChannel(newChannel);
  }

  useEffect(() => {
    fetchChannel().catch(() => {
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
