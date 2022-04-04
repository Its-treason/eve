import {ReducedChannel} from "../api/sharedApiTypes";
import {useEffect, useState} from "react";
import ServerApi from "../api/ServerApi";

interface UseServerChannelData {
  channel: ReducedChannel[],
  channelLoading: boolean,
  channelError: string|null,
  fetchChannel: () => Promise<void>,
}

function useServerChannel(serverId: string, type?: 'text'|'voice'): UseServerChannelData {
  const [channel, setChannel] = useState([]);
  const [channelLoading, setChannelLoading] = useState(true);
  const [channelError, setChannelError] = useState(null);

  async function fetchChannel() {
    if (serverId === '') {
      return;
    }

    setChannelLoading(true);

    let newChannel = await ServerApi.getChannel(serverId);

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
