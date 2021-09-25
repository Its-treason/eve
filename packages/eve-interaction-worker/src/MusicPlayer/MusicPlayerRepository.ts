import { MusicPlayer } from './MusicPlayer';
import { StageChannel, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js';

export default class MusicPlayerRepository {
  private static musicPlayers = new Map<string, MusicPlayer>();

  public static has(serverId: string): boolean {
    const hasPlayer = this.musicPlayers.has(serverId);

    if (hasPlayer === false) {
      return false;
    }

    const player = this.musicPlayers.get(serverId);

    if (player.destroyed === true) {
      MusicPlayerRepository.destroy(serverId);
      return false;
    }
    return true;
  }

  public static get(serverId: string): MusicPlayer {
    const player = this.musicPlayers.get(serverId);

    if (player.destroyed === true) {
      MusicPlayerRepository.destroy(serverId);
      return null;
    }

    return player;
  }

  public static create(channel: VoiceChannel|StageChannel, textChannel: TextChannel|ThreadChannel): MusicPlayer {
    const player = new MusicPlayer(channel, textChannel);

    this.musicPlayers.set(channel.guild.id, player);

    return player;
  }

  public static async destroy(serverId: string): Promise<boolean> {
    if (!this.musicPlayers.has(serverId)) {
      return false;
    }

    const player = this.musicPlayers.get(serverId);
    await player.destroy();
    this.musicPlayers.delete(serverId);

    return true;
  }
}
