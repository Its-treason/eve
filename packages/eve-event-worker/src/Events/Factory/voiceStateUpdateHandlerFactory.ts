import { Container } from 'treason-di';
import ChannelActivityProjection from '../../Projection/ChannelActivityProjection';
import VoiceStateUpdateHandler from '../VoiceStateUpdateHandler';

export default async function voiceStateUpdateHandlerFactory(container: Container): Promise<VoiceStateUpdateHandler> {
  const channelActivityProjection = await container.get<ChannelActivityProjection>(ChannelActivityProjection);

  return new VoiceStateUpdateHandler(channelActivityProjection);
}
