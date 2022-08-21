import { MusicPlayer } from './MusicPlayer';
import { TextBasedChannel, VoiceBasedChannel } from 'discord.js';

export default class MusicPlayerRepository {
  private static musicPlayers = new Map<string, MusicPlayer>();

  public static async has(serverId: string): Promise<boolean> {
    if (this.musicPlayers.has(serverId) === false) {
      return false;
    }

    const player = this.musicPlayers.get(serverId);

    if (player?.destroyed !== false) {
      await MusicPlayerRepository.destroy(serverId);
      return false;
    }
    return true;
  }

  public static async get(serverId: string): Promise<MusicPlayer|null> {
    const player = this.musicPlayers.get(serverId);

    if (player?.destroyed === true) {
      await MusicPlayerRepository.destroy(serverId);
      return null;
    }

    return player || null;
  }

  public static create(channel: VoiceBasedChannel, textChannel: TextBasedChannel): MusicPlayer {
    const player = new MusicPlayer(channel, textChannel);

    this.musicPlayers.set(channel.guild.id, player);

    return player;
  }

  public static async destroy(serverId: string): Promise<boolean> {
    if (!this.musicPlayers.has(serverId)) {
      return false;
    }

    const player = this.musicPlayers.get(serverId);
    await player?.destroy();
    this.musicPlayers.delete(serverId);

    return true;
  }
}
